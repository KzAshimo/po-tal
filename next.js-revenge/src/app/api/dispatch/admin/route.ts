// src/app/api/dispatch/admin.ts
import connection from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [location] = await connection.query(`
      SELECT location_logs.*, users.username
      FROM location_logs
      JOIN users ON location_logs.user_id = users.id
    `);

    return NextResponse.json({ location });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
  }
}
