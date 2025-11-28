'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getUserProfile, getUserBookings, updateUserProfile } from "@/utils/api";

export default function ProfilePage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [bookingHistory, setBookingHistory] = useState([]);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  useEffect(() => {
    const auth =
      typeof window !== "undefined" && localStorage.getItem("isAuthenticated") === "true";
    const storedUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    setIsAuthenticated(auth);
    setUserId(storedUserId);
    setAuthChecked(true);

    if (!auth) {
      router.replace("/login");
    }
  }, [router]);

  // Load cached profile to prevent UI flash
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("profileData");
    if (!saved) return;

    try {
      const profile = JSON.parse(saved);
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
      if (profile.profile_image) {
        setProfileImagePreview(profile.profile_image);
      }
    } catch (error) {
      console.warn("Failed to parse cached profile:", error);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const profileRes = await getUserProfile(userId);
        if (profileRes?.success && profileRes.user) {
          const profile = profileRes.user;

          localStorage.setItem("userId", profile.id);
          if (profile.email) {
            localStorage.setItem("userEmail", profile.email);
          }
          localStorage.setItem(
            "profileData",
            JSON.stringify({
              userId: profile.id,
              name: profile.full_name || "",
              phone: profile.phone || "",
              address: profile.address || "",
              profile_image: profile.profile_image || "",
            })
          );

          setFormData({
            name: profile.full_name || "",
            phone: profile.phone || "",
            address: profile.address || "",
          });

          setProfileImagePreview(profile.profile_image || null);
        }

        const bookingsRes = await getUserBookings(userId);
        if (Array.isArray(bookingsRes)) {
          setBookingHistory(
            bookingsRes.map((booking) => ({
              id: booking.id,
              service: booking.service,
              date: booking.date,
              time: booking.time,
              notes: booking.additional_notes || "",
              createdAt: booking.created_at,
              documents: booking.documents || [],
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch profile or bookings:", err);
      }
    };

    fetchData();
  }, [userId]);

  if (!authChecked || !isAuthenticated) return null;

  // --------------------------
  // Handlers
  // --------------------------
  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("profileData");
      router.push("/login");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please upload a valid image");
    if (file.size > 5 * 1024 * 1024) return alert("Image must be under 5MB");

    setProfileImage(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!userId) {
      alert("User session expired. Please log in again.");
      router.push("/login");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("user_id", userId);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      if (profileImage) {
        formDataToSend.append("profile_image", profileImage);
      }

      const data = await updateUserProfile(formDataToSend);

      if (data?.success && data.profile_image !== undefined) {
        setProfileImagePreview(data.profile_image || profileImagePreview);
      }

      localStorage.setItem(
        "profileData",
        JSON.stringify({
          userId,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          profile_image: data?.profile_image || profileImagePreview || null,
        })
      );

      alert("Profile updated successfully!");
      setIsEditing(false);
      setProfileImage(null);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to update profile: " + (err?.message || "Server error"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-60 bg-gradient-to-b from-white to-gray-50 shadow-2xl z-50 flex flex-col">
        <div className="px-6 py-6 flex items-center gap-3 border-b border-gray-200 bg-white">
          <Image src="/images/logo.png" alt="logo" width={48} height={48} className="object-contain" priority />
          <div>
            <div className="text-lg font-semibold text-blue-600">Hapsaé</div>
            <div className="text-xs text-gray-500">Cleaning Services</div>
          </div>
        </div>
        <nav className="px-4 py-6 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            <li><Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition">🏠 Home</Link></li>
            <li><Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">👤 Profile</Link></li>
            <li><Link href="/booking" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">📅 Booking</Link></li>
            <li><Link href="/feedback" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">💬 Feedback</Link></li>
          </ul>
        </nav>
       <div className="px-4 py-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleSignOut}
            className="w-full text-sm bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-md">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-60 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Form */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Profile Pic */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden text-4xl">
                  {profileImagePreview ? (
                    <Image src={profileImagePreview} alt="Profile" width={96} height={96} className="object-cover rounded-full" />
                  ) : <span>👤</span>}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <span className="text-white text-sm">📷</span>
                  </label>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{formData.name}</h2>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-500`} />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-500`} />
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea name="address" id="address" value={formData.address} onChange={handleInputChange} disabled={!isEditing} rows={2}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-500`} />
                  {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                {!isEditing ? (
                  <button type="button" onClick={() => setIsEditing(true)} className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg">Edit Profile</button>
                ) : (
                  <>
                    <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-3 px-6 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200">Cancel</button>
                    <button type="submit" className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg">Save Changes</button>
                  </>
                )}
              </div>
            </form>
          </div>

          {/* Booking History */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking History</h3>
            {bookingHistory.length === 0 ? (
              <p className="text-gray-500">No bookings yet.</p>
            ) : (
              <ul className="space-y-4">
            {bookingHistory.map(booking => (
                  <li key={booking.id} className="border p-4 rounded-lg hover:shadow-md transition">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{booking.service}</span>
                  <span className="text-sm font-medium text-blue-600">Scheduled</span>
                    </div>
                <div className="text-sm text-gray-500">
                  {booking.date} at {booking.time}
                </div>
                {booking.notes && (
                  <div className="text-sm text-gray-500 mt-1 whitespace-pre-line">
                    {booking.notes}
                  </div>
                )}
                {booking.documents && booking.documents.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-500 mb-1">Attachments</div>
                    <div className="flex flex-wrap gap-2">
                      {booking.documents.map((doc, index) => (
                        <a
                          key={`${booking.id}-doc-${index}`}
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded"
                        >
                          Document {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {booking.createdAt && (
                  <div className="text-xs text-gray-400 mt-2">
                    Created: {new Date(booking.createdAt).toLocaleString()}
                  </div>
                )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
