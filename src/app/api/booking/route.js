import { promises as fs } from "fs";
import path from "path";
import { query } from "@/helpers/dbconnection";

const documentsDir = path.join(process.cwd(), "public", "uploads", "documents");

async function addDocumentsToBookings(bookings) {
  if (!bookings.length) return bookings;

  const bookingIds = bookings.map((booking) => booking.id);
  const placeholders = bookings.length === 1 ? "(?)" : `(${bookingIds.map(() => "?").join(",")})`;
  const docs = await query(
    `SELECT booking_id, document_image FROM documents WHERE booking_id IN ${placeholders}`,
    bookingIds
  );

  const docMap = docs.reduce((acc, doc) => {
    acc[doc.booking_id] = acc[doc.booking_id] || [];
    acc[doc.booking_id].push(doc.document_image);
    return acc;
  }, {});

  return bookings.map((booking) => ({
    ...booking,
    documents: docMap[booking.id] || [],
  }));
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (userId && Number.isNaN(Number(userId))) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid user_id" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const sql = userId
      ? `SELECT id, user_id, service, date, time, additional_notes, created_at 
         FROM bookings 
         WHERE user_id = ?
         ORDER BY created_at DESC`
      : `SELECT id, user_id, service, date, time, additional_notes, created_at 
         FROM bookings 
         ORDER BY created_at DESC`;

    const bookings = await query(sql, userId ? [userId] : []);
    const bookingsWithDocuments = await addDocumentsToBookings(bookings);

    return new Response(JSON.stringify(bookingsWithDocuments), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to fetch bookings" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let payload = {};
    let documentFiles = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      payload = {
        user_id: Number(formData.get("user_id")),
        service: formData.get("service"),
        date: formData.get("date"),
        time: formData.get("time"),
        additional_notes: formData.get("additional_notes") || null,
      };
      documentFiles = formData
        .getAll("documents")
        .filter((value) => typeof value === "object" && value?.size > 0);
    } else {
      payload = await request.json();
    }

    const { user_id, service, date, time, additional_notes } = payload || {};

    if (!user_id || !service || !date || !time) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing booking details" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await query(
      `INSERT INTO bookings (user_id, service, date, time, additional_notes) 
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, service, date, time, additional_notes || null]
    );

    const bookingId = result.insertId;
    const savedDocuments = [];

    if (documentFiles.length) {
      await fs.mkdir(documentsDir, { recursive: true });

      for (const file of documentFiles) {
        const extension = path.extname(file.name) || "";
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
        const filePath = path.join(documentsDir, fileName);
        const arrayBuffer = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(arrayBuffer));
        const relativePath = `/uploads/documents/${fileName}`;
        savedDocuments.push(relativePath);
      }

      const values = savedDocuments.flatMap((docPath) => [bookingId, docPath]);
      const placeholders = savedDocuments.map(() => "(?, ?)").join(", ");
      await query(
        `INSERT INTO documents (booking_id, document_image) VALUES ${placeholders}`,
        values
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        booking: {
          id: bookingId,
          user_id,
          service,
          date,
          time,
          additional_notes: additional_notes || null,
          documents: savedDocuments,
        },
        message: "Booking created successfully",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Failed to create booking:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to create booking" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}