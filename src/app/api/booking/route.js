import { NextResponse } from "next/server";
import { query } from "@/helpers/dbconnection";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");
  if (!user_id) return NextResponse.json([], { status: 200 });

  const [rows] = await query("SELECT * FROM bookings WHERE user_id=? ORDER BY date DESC", [user_id]);
  return NextResponse.json(rows);
}
