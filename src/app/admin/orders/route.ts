
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "nexcell_db",
});

export async function GET() {
  const [orders] = await db.execute(
    "SELECT * FROM orders ORDER BY id DESC"
  );

  return NextResponse.json({
    orders,
  });
}