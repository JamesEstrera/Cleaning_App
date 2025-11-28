import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
});

function handleError(error) {
  if (error.response?.data) {
    throw error.response.data;
  }
  throw { success: false, message: error.message || "Request failed" };
}

export async function registerUser(payload) {
  try {
    const { data } = await apiClient.post("/api/auth/register", payload);
    return data;
  } catch (error) {
    handleError(error);
  }
}

export async function loginUser(payload) {
  try {
    const { data } = await apiClient.post("/api/auth/login", payload);
    return data;
  } catch (error) {
    handleError(error);
  }
}

export async function getUserProfile(userId) {
  if (!userId) return null;
  try {
    const { data } = await apiClient.get("/api/profile", {
      params: { user_id: userId },
    });
    return data;
  } catch (error) {
    handleError(error);
  }
}

export async function updateUserProfile(formData) {
  try {
    const { data } = await apiClient.post("/api/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    handleError(error);
  }
}

export async function getUserBookings(userId) {
  if (!userId) return [];
  try {
    const { data } = await apiClient.get("/api/booking", {
      params: { user_id: userId },
    });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    handleError(error);
  }
}

export async function createBooking(payload) {
  try {
    const isFormData =
      typeof FormData !== "undefined" && payload instanceof FormData;
    const config = isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined;

    const { data } = await apiClient.post("/api/booking", payload, config);
    return data;
  } catch (error) {
    handleError(error);
  }
}

export async function submitFeedback(payload) {
  try {
    const { data } = await apiClient.post("/api/feedback", payload);
    return data;
  } catch (error) {
    handleError(error);
  }
}

export async function getFeedback() {
  try {
    const { data } = await apiClient.get("/api/feedback");
    return data;
  } catch (error) {
    handleError(error);
  }
}
