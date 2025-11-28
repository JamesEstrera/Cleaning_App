import { query } from "@/helpers/dbconnection";

export async function GET() {
  try {
    const feedback = await query(`
      SELECT 
        f.id,
        f.user_id,
        f.rating,
        f.category,
        f.feedback,
        f.created_at,
        COALESCE(p.full_name, u.email) AS author_name
      FROM feedback f
      JOIN users u ON f.user_id = u.id
      LEFT JOIN profiles p ON p.user_id = u.id
      ORDER BY f.created_at DESC
    `);

    return new Response(JSON.stringify(feedback), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch feedback:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to fetch feedback" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, rating, category, feedback } = body || {};

    if (!user_id || !rating || !category || !feedback?.trim()) {
      return new Response(
        JSON.stringify({ success: false, message: "Incomplete feedback data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await query(
      `INSERT INTO feedback (user_id, rating, category, feedback) 
       VALUES (?, ?, ?, ?)`,
      [user_id, rating, category, feedback.trim()]
    );

    return new Response(
      JSON.stringify({
        success: true,
        feedback: {
          id: result.insertId,
          user_id,
          rating,
          category,
          feedback: feedback.trim(),
        },
        message: "Feedback submitted successfully",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Failed to submit feedback:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to submit feedback" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}