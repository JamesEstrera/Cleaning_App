'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { submitFeedback } from "@/utils/api";

export default function FeedbackPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    rating: 0,
    category: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth =
      typeof window !== "undefined" && localStorage.getItem("isAuthenticated") === "true";
    const storedUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    if (!auth || !storedUserId) {
      router.replace("/login");
      return;
    }

    setUserId(storedUserId);
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("profileData");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.rating) newErrors.rating = "Rating is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.message.trim()) newErrors.message = "Feedback is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Please log in before submitting feedback.");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const payload = {
        user_id: parseInt(userId, 10),
        rating: formData.rating,
        category: formData.category,
        feedback: formData.name
          ? `${formData.name}: ${formData.message}`
          : formData.message,
      };

      const data = await submitFeedback(payload);

      if (data?.success) {
        setSubmitSuccess(true);
        setFormData({ name: "", rating: 0, category: "", message: "" });
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while submitting feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 relative">

      <aside className="fixed top-0 left-0 h-full w-60 bg-gradient-to-b from-white to-gray-50 shadow-2xl z-50 flex flex-col">

        {/* Sidebar Header */}
        <div className="px-6 py-6 flex items-center gap-3 border-b border-gray-200 bg-white">
          <Image src="/images/logo.png" alt="logo" width={48} height={48} className="object-contain" />
          <div>
            <div className="text-lg font-semibold text-blue-600">Hapsaé</div>
            <div className="text-xs text-gray-500">Cleaning Services</div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="px-4 py-6 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                <span className="text-xl">🏠</span> <span className="font-medium">Home</span>
              </Link>
            </li>

            <li>
              <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
                <span className="text-xl">👤</span> <span className="font-medium">Profile</span>
              </Link>
            </li>

            <li>
              <Link href="/booking" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
                <span className="text-xl">📅</span> <span className="font-medium">Booking</span>
              </Link>
            </li>

            <li>
              <Link href="/feedback" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
                <span className="text-xl">💬</span> <span className="font-medium">Feedback</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Sign Out */}
        <div className="px-4 py-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleSignOut}
            className="w-full text-sm bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="min-h-screen">
    
        <main className="max-w-5xl px-4 py-8 ml-100">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Your Feedback</h1>
            <p className="text-gray-600">We value your opinion! Help us improve our services</p>
          </div>

          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center gap-2">
              <span className="text-xl">✓</span>
              <span>Thank you! Your feedback has been submitted successfully.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, rating: star }));
                      if (errors.rating) {
                        setErrors(prev => ({ ...prev, rating: '' }));
                      }
                    }}
                    className={`text-4xl transition-transform duration-200 hover:scale-110 ${
                      formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="mt-1 text-sm text-red-500">{errors.rating}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
              >
                <option value="">Select a category</option>
                <option value="service">Service Quality</option>
                <option value="staff">Staff Behavior</option>
                <option value="pricing">Pricing</option>
                <option value="booking">Booking Process</option>
                <option value="other">Other</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                Your Feedback <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
                placeholder="Share your thoughts, suggestions, or concerns..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">{errors.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.message.length} characters (minimum 60)
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

