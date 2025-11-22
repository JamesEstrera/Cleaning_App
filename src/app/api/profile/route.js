import { promises as fs } from "fs";
import path from "path";
import { query } from "@/helpers/dbconnection";

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const user_id = formData.get("user_id");
    const name = formData.get("name");
    const phone = formData.get("phone");
    const address = formData.get("address");

    let profile_image = null;
    const file = formData.get("profile_image");
    if (file && file.size > 0) {
      const uploadsDir = path.join(process.cwd(), "/public/uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filePath = path.join(uploadsDir, file.name);
      await fs.writeFile(filePath, buffer);
      profile_image = `/uploads/${file.name}`;
    }

    // UPSERT
    await query(
      `INSERT INTO profiles (user_id, full_name, phone, address, profile_image)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         full_name = VALUES(full_name),
         phone = VALUES(phone),
         address = VALUES(address),
         profile_image = VALUES(profile_image)`,
      [user_id, name, phone, address, profile_image]
    );

    return new Response(JSON.stringify({ success: true, profile_image }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
