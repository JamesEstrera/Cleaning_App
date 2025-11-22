import { query } from "@/helpers/dbconnection";

export const POST = async (req) => {
  try {
    const formData = await req.json(); // using JSON body
    const { name, rating, category, feedback } = formData;

    if (!name || !rating || !category || !feedback) {
      return new Response(
        JSON.stringify({ success: false, error: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await query(
      `INSERT INTO feedback (name, rating, category, feedback)
       VALUES (?, ?, ?, ?)`,
      [name, rating, category, feedback]
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
