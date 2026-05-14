import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

async function getDBConnection() {
  return await mysql.createConnection({
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

    const { email, password } = body;

    const [rows]: any = await db.execute(
      `
      SELECT * FROM admins
      WHERE email = ?
      `,
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin not found",
        },
        {
          status: 404,
        }
      );
    }

    const admin = rows[0];

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (password !== admin.password) {
  return NextResponse.json(
    {
      success: false,
      message: "Invalid password",
    },
    {
      status: 401,
    }
  );
}

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
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