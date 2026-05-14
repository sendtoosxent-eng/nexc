import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";

async function getDBConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nexcell_db",
  });
}

export async function POST(req: Request) {
  try {
    const db = await getDBConnection();

    const body = await req.json();

    const { orderId, status } = body;

    await db.execute(
      `
      UPDATE orders
      SET status = ?
      WHERE id = ?
      `,
      [status, orderId]
    );

    const [rows]: any = await db.execute(
      `
      SELECT *
      FROM orders
      WHERE id = ?
      `,
      [orderId]
    );

    const order = rows[0];

    // EMAIL TRANSPORTER
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // SEND EMAIL TO CUSTOMER
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.customer_email,
      subject: `Order #${order.id} Updated`,

      html: `
  <div
    style="
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: auto;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      background: #ffffff;
    "
  >
    <!-- HEADER -->
    <div
      style="
        background: linear-gradient(135deg, #0ea5e9, #111827);
        padding: 30px;
        text-align: center;
        color: white;
      "
    >
      <h1 style="margin:0;font-size:28px;">
        Nexcell Gadgets
      </h1>

      <p style="margin-top:10px;font-size:14px;">
        Order Status Update
      </p>
    </div>

    <!-- BODY -->
    <div style="padding:30px; color:#111827;">

      <h2 style="margin-top:0;">
        Hello ${order.customer_name},
      </h2>

      <p style="font-size:15px; line-height:1.7;">
        Your order
        <strong>#${order.id}</strong>
        has been successfully updated to
        <strong style="color:#0ea5e9;">
          ${status}
        </strong>.
      </p>

      <div
        style="
          background:#f0f9ff;
          border-left:4px solid #0ea5e9;
          padding:18px;
          border-radius:8px;
          margin:25px 0;
        "
      >
        <p style="margin:0 0 10px 0;">
          <strong>Delivery Address:</strong>
        </p>

        <p style="margin:0;color:#374151;">
          ${order.address},
          ${order.city},
          ${order.country}
        </p>
      </div>

      <div
        style="
          background:#fefce8;
          border-left:4px solid #eab308;
          padding:18px;
          border-radius:8px;
          margin:25px 0;
        "
      >
        <p style="margin:0; line-height:1.7;">
          Please keep your phone number
          <strong>(${order.phone})</strong>
          reachable because our delivery team will contact you shortly regarding your order delivery.
        </p>
      </div>

      <div
        style="
          background:#f9fafb;
          padding:20px;
          border-radius:10px;
          margin-top:20px;
        "
      >
        <p><strong>Order ID:</strong> #${order.id}</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Payment Method:</strong> ${order.payment_method}</p>
        <p><strong>Total:</strong> UGX ${Number(order.total).toLocaleString()}</p>
      </div>

      <p
        style="
          margin-top:30px;
          line-height:1.7;
          color:#4b5563;
        "
      >
        Thank you for shopping with Nexcell Gadgets.
        We appreciate your trust in us.
      </p>
    </div>

    <!-- FOOTER -->
    <div
      style="
        background:#111827;
        color:#9ca3af;
        text-align:center;
        padding:20px;
        font-size:13px;
      "
    >
      Nexcell Gadgets • Kampala, Uganda
    </div>
  </div>
`,
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}