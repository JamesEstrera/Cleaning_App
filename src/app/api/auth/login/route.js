import { query } from '@/helpers/dbconnection';
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ success: false, message: "Email and password required" }), { status: 400 });
    }

    const users = await query("SELECT id, email, password FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return new Response(JSON.stringify({ success: false, message: "Invalid email or password" }), { status: 400 });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ success: false, message: "Invalid email or password" }), { status: 400 });
    }

    // Return user data including ID
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email
      }
    }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
  }
}