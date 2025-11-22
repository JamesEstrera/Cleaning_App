import { query } from "@/helpers/dbconnection"; // Adjust your path for alias if needed
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ success: false, message: "Email and password required" }), { status: 400 });
    }

    const existingUsers = await query("SELECT id FROM users WHERE email = ?", [email]);
    if (existingUsers.length > 0) {
      return new Response(JSON.stringify({ success: false, message: "Email already registered" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await query("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword]);

    return new Response(JSON.stringify({ success: true, message: "User created successfully" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
  }
}
