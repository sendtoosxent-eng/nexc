import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "nexcell_db",
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const user_id = searchParams.get("user_id");

  const [orders] = await db.execute(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC",
    [user_id]
  );

  return NextResponse.json({
    orders,
  });
}