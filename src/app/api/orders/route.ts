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

export async function POST(req: Request) {
  let db: any;

  try {
    db = await getDBConnection();

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

    // =========================
    // SAVE ORDER
    // =========================

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

    // =========================
    // SAVE ORDER ITEMS
    // =========================

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

    // =========================
    // GENERATE ITEMS HTML
    // =========================

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
            UGX ${Number(item.discountedPrice).toLocaleString()}
          </td>

          <td style="padding:10px;border:1px solid #ddd;">
            UGX ${(
              item.discountedPrice * item.quantity
            ).toLocaleString()}
          </td>
        </tr>
      `;
    });

    // =========================
    // MAIL TRANSPORTER
    // =========================

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // =========================
    // ADMIN EMAIL
    // =========================

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,

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
              Total: UGX ${Number(total).toLocaleString()}
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

      console.log("Admin email sent");
    } catch (error) {
      console.log("Admin email failed:", error);
    }

    // =========================
    // CUSTOMER EMAIL
    // =========================

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,

        to: customer_email,

        subject: `Order Confirmation #${orderId}`,

        html: `
          <div
            style="
              font-family:Arial;
              background:#f4f7fb;
              padding:30px;
            "
          >
            <div
              style="
                max-width:650px;
                margin:auto;
                background:white;
                border-radius:16px;
                overflow:hidden;
                box-shadow:0 5px 20px rgba(0,0,0,0.08);
              "
            >

              <div
                style="
                  background:#0ea5e9;
                  color:white;
                  padding:35px;
                  text-align:center;
                "
              >
                <h1 style="margin:0;">
                  Thank You For Your Order 🎉
                </h1>

                <p style="margin-top:10px;">
                  Your order has been received successfully.
                </p>
              </div>

              <div style="padding:30px;">

                <h2>
                  Hello ${customer_name},
                </h2>

                <p style="line-height:28px;color:#444;">
                  Thank you for shopping with Nexcell Gadgets.
                  We are currently processing your order
                  and you will receive another notification
                  once your order is confirmed.
                </p>

                <div
                  style="
                    background:#f8fafc;
                    padding:20px;
                    border-radius:12px;
                    margin-top:25px;
                  "
                >
                  <p>
                    <strong>Order ID:</strong>
                    #${orderId}
                  </p>

                  <p>
                    <strong>Total:</strong>
                    UGX ${Number(total).toLocaleString()}
                  </p>

                  <p>
                    <strong>Status:</strong>
                    ${status}
                  </p>

                  <p>
                    <strong>Payment Method:</strong>
                    ${payment_method}
                  </p>
                </div>

                <h3 style="margin-top:30px;">
                  Order Summary
                </h3>

                <table
                  style="
                    border-collapse:collapse;
                    width:100%;
                    margin-top:15px;
                  "
                >
                  <thead>
                    <tr style="background:#f1f5f9;">
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

                <p
                  style="
                    margin-top:30px;
                    line-height:28px;
                    color:#444;
                  "
                >
                  We appreciate your support and look
                  forward to serving you again.
                </p>

                <a
                  href="http://localhost:3000/dashboard"
                  style="
                    display:inline-block;
                    margin-top:20px;
                    background:#0ea5e9;
                    color:white;
                    text-decoration:none;
                    padding:14px 28px;
                    border-radius:10px;
                    font-weight:bold;
                  "
                >
                  View Dashboard
                </a>

              </div>
            </div>
          </div>
        `,
      });

      console.log("Customer email sent");
    } catch (error) {
      console.log("Customer email failed:", error);
    }

    // CLOSE DB CONNECTION
    await db.end();

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      orderId,
    });

  } catch (error) {
    console.log(error);

    if (db) {
      await db.end();
    }

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