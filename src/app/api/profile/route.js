import { promises as fs } from "fs";
import path from "path";
import { query } from "@/helpers/dbconnection";

const uploadsDir = path.join(process.cwd(), "public", "uploads");

async function getProfile(userId) {
  const profiles = await query(
    `SELECT id, user_id, full_name, phone, address, profile_image, updated_at
     FROM profiles
     WHERE user_id = ?`,
    [userId]
  );
  return profiles[0] || null;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, message: "user_id is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const users = await query(
      `SELECT id, email, created_at FROM users WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const profile = await getProfile(userId);

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: users[0].id,
          email: users[0].email,
          full_name: profile?.full_name || "",
          phone: profile?.phone || "",
          address: profile?.address || "",
          profile_image: profile?.profile_image || "",
          updated_at: profile?.updated_at || users[0].created_at,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to fetch profile" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const user_id = formData.get("user_id");
    const name = formData.get("name");
    const phone = formData.get("phone");
    const address = formData.get("address");

    if (!user_id) {
      return new Response(
        JSON.stringify({ success: false, message: "user_id is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let profile_image = null;
    const file = formData.get("profile_image");
    if (file && file.size > 0) {
      await fs.mkdir(uploadsDir, { recursive: true });

      const fileExt = path.extname(file.name) || "";
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
      const filePath = path.join(uploadsDir, fileName);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);
      profile_image = `/uploads/${fileName}`;
    } else {
      const existing = await getProfile(user_id);
      profile_image = existing?.profile_image || null;
    }

    await query(
      `INSERT INTO profiles (user_id, full_name, phone, address, profile_image)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         full_name = VALUES(full_name),
         phone = VALUES(phone),
         address = VALUES(address),
         profile_image = VALUES(profile_image),
         updated_at = CURRENT_TIMESTAMP`,
      [user_id, name, phone, address, profile_image]
    );

    const profile = await getProfile(user_id);

    return new Response(
      JSON.stringify({
        success: true,
        user: profile,
        profile_image: profile?.profile_image || null,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Failed to upsert profile:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to save profile" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
