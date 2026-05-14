import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";

// DATABASE CONNECTION
async function getDBConnection() {
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nexcell_db",
  });
}

// ======================================
// GET ALL ORDERS FOR ADMIN DASHBOARD
// ======================================

export async function GET() {
  try {
    const db = await getDBConnection();

    const [orders]: any = await db.execute(`
      SELECT *
      FROM orders
      ORDER BY created_at DESC
    `);

    // GET ORDER ITEMS
    for (const order of orders) {
      const [items]: any = await db.execute(
        `
        SELECT *
        FROM order_items
        WHERE order_id = ?
        `,
        [order.id]
      );

      order.items = items;
    }

    return NextResponse.json({
      success: true,
      orders,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders",
      },
      {
        status: 500,
      }
    );
  }
}

// ======================================
// SAVE ORDER + SEND EMAIL
// ======================================

export async function POST(req: Request) {
  try {
    const db = await getDBConnection();

    const body = await req.json();

    const {
      user_id,
      customer_name,
      customer_email,
      phone,
      country,
      city,
      address,
      notes,
      payment_method,
      total,
      status,
      items,
    } = body;

    // ======================================
    // SAVE ORDER
    // ======================================

    const [result]: any = await db.execute(
      `
      INSERT INTO orders
      (
        user_id,
        customer_name,
        customer_email,
        phone,
        country,
        city,
        address,
        notes,
        payment_method,
        total,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user_id,
        customer_name,
        customer_email,
        phone,
        country,
        city,
        address,
        notes,
        payment_method,
        total,
        status,
      ]
    );

    const orderId = result.insertId;

    // ======================================
    // SAVE ORDER ITEMS
    // ======================================

    for (const item of items) {
      await db.execute(
        `
        INSERT INTO order_items
        (
          order_id,
          product_name,
          price,
          quantity,
          subtotal
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          orderId,
          item.title,
          item.discountedPrice,
          item.quantity,
          item.discountedPrice * item.quantity,
        ]
      );
    }

    // ======================================
    // CREATE ITEMS HTML
    // ======================================

    let itemsHTML = "";

    items.forEach((item: any) => {
      itemsHTML += `
        <tr>
          <td style="padding:10px;border:1px solid #ddd;">
            ${item.title}
          </td>

          <td style="padding:10px;border:1px solid #ddd;">
            ${item.quantity}
          </td>

          <td style="padding:10px;border:1px solid #ddd;">
            UGX ${item.discountedPrice}
          </td>

          <td style="padding:10px;border:1px solid #ddd;">
            UGX ${item.discountedPrice * item.quantity}
          </td>
        </tr>
      `;
    });

    // ======================================
    // EMAIL TRANSPORTER
    // ======================================

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ======================================
    // SEND EMAIL TO ADMIN
    // ======================================

    await transporter.sendMail({
      from: `"Nexcell Gadgets" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,

      subject: `New Order #${orderId}`,

      html: `
        <div style="font-family:Arial;padding:20px;">
          <h2>New Customer Order</h2>

          <p>
            A new order has been placed successfully.
          </p>

          <h3>Customer Details</h3>

          <p><strong>Name:</strong> ${customer_name}</p>
          <p><strong>Email:</strong> ${customer_email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Country:</strong> ${country}</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>Address:</strong> ${address}</p>

          <h3>Order Items</h3>

          <table
            style="
              border-collapse:collapse;
              width:100%;
            "
          >
            <thead>
              <tr>
                <th style="padding:10px;border:1px solid #ddd;">
                  Product
                </th>

                <th style="padding:10px;border:1px solid #ddd;">
                  Qty
                </th>

                <th style="padding:10px;border:1px solid #ddd;">
                  Price
                </th>

                <th style="padding:10px;border:1px solid #ddd;">
                  Subtotal
                </th>
              </tr>
            </thead>

            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <h2 style="margin-top:20px;">
            Total: UGX ${total}
          </h2>

          <p>
            <strong>Payment Method:</strong>
            ${payment_method}
          </p>

          <p>
            <strong>Status:</strong>
            ${status}
          </p>

          <p>
            <strong>Notes:</strong>
            ${notes || "No notes"}
          </p>
        </div>
      `,
    });

    // ======================================
    // SEND EMAIL TO CUSTOMER
    // ======================================

    await transporter.sendMail({
      from: `"Nexcell Gadgets" <${process.env.EMAIL_USER}>`,
      to: customer_email,

      subject: `Order Received Successfully #${orderId}`,

      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e1e1e1; padding: 20px;">
          <h2 style="color: #1a1a1a;">Order Confirmation</h2>
          <p>Hi <strong>${customer_name}</strong>,</p>
          <p>Your order <strong>#${orderId}</strong> has been officially <strong>Approved</strong> by Nexcell Gadgets!</p>
          
          <div style="background-color: #fff9c4; border-left: 5px solid #fbc02d; padding: 15px; margin: 20px 0;">
            <strong>Action Required:</strong> Please keep your phone reachable. Our delivery team will call you shortly to coordinate the drop-off.
          </div>

          <p>Thank you for shopping with us!</p>
          <hr />
          <p style="font-size: 12px; color: #888;">Nexcell Gadgets | Kampala, Uganda</p>
        </div>
      `,

    });

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      orderId,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}