// /app/utils/api.js

// Register User
export async function registerUser({ email, password }) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

// Login User
export async function loginUser({ email, password }) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}


// Helper to safely parse JSON
async function safeJson(res) {
  try {
    return await res.json();
  } catch (err) {
    console.error("Failed to parse JSON:", err, await res.text());
    return null;
  }
}

// Get user profile by ID
export async function getUserProfile(userId) {
  if (!userId) return null;

  try {
    const res = await fetch(`/api/user?user_id=${userId}`);
    if (!res.ok) {
      console.error("Failed to fetch user profile:", res.status);
      return null;
    }
    const data = await safeJson(res);
    return data; // expects { success: true, user: { full_name, phone, address, profile_image } }
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return null;
  }
}

// Update user profile
export async function updateUserProfile(userId, profileData) {
  if (!userId) return null;

  try {
    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, ...profileData }),
    });
    if (!res.ok) {
      console.error("Failed to update profile:", res.status);
      return null;
    }
    const data = await safeJson(res);
    return data; // expects { success: true }
  } catch (err) {
    console.error("Error updating user profile:", err);
    return null;
  }
}

// Get bookings for a user
export async function getUserBookings(userId) {
  if (!userId) return [];

  try {
    const res = await fetch(`/api/booking?user_id=${userId}`);
    if (!res.ok) {
      console.error("Failed to fetch bookings:", res.status);
      return [];
    }
    const data = await safeJson(res);
    if (!Array.isArray(data)) return [];
    return data;
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return [];
  }
}


// Create a new booking
export async function createBooking(data) {
  // data should include: user_id, service, date, time, price, notes
  const res = await fetch("/api/booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  return result;
}


// Submit Feedback
export async function submitFeedback(data) {
  const res = await fetch("/api/feedback", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  });
  return res.json();
}

// Get Feedback
export async function getFeedback() {
  const res = await fetch("/api/feedback");
  return res.json();
}




