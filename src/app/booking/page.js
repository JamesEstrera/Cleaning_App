'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function BookingPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [documents, setDocuments] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const auth = typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(auth);
    setAuthChecked(true);
    if (!auth) {
      router.replace('/login');
    }
  }, [router]);

  if (!authChecked) return null;
  if (!isAuthenticated) return null;

  const services = [
    { id: 'house', name: 'House Cleaning', icon: '🏠', price: '$120' },
    { id: 'office', name: 'Office Cleaning', icon: '🏢', price: '$200' },
    { id: 'deep', name: 'Deep Cleaning', icon: '✨', price: '$250' },
    { id: 'move', name: 'Move In/Out Cleaning', icon: '📦', price: '$300' }
  ];

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthenticated');
      setIsSidebarOpen(false);
      router.push('/login');
    }
  };

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          documents: 'File size must be less than 10MB'
        }));
        return false;
      }
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          documents: 'Only images and documents are allowed'
        }));
        return false;
      }
      return true;
    });

    setDocuments(prev => [...prev, ...validFiles]);
    setErrors(prev => ({
      ...prev,
      documents: ''
    }));
  };

  const removeDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedService) {
      newErrors.service = 'Please select a service';
    }

    if (!selectedDate) {
      newErrors.date = 'Please select a date';
    } else {
      const selected = new Date(selectedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.date = 'Please select a future date';
      }
    }

    if (!selectedTime) {
      newErrors.time = 'Please select a time slot';
    }

    if (!address.trim()) {
      newErrors.address = 'Service address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Booking submitted successfully!');
      // Reset form
      setSelectedService('');
      setSelectedDate('');
      setSelectedTime('');
      setAddress('');
      setNotes('');
      setDocuments([]);
    }, 1500);
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

        <main className="max-w-4xl px-4 py-8 ml-100">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Cleaning Service</h1>
            <p className="text-gray-600">Schedule your cleaning service at your convenience</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6">
            {/* Service Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Service <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => {
                      setSelectedService(service.id);
                      if (errors.service) {
                        setErrors(prev => ({ ...prev, service: '' }));
                      }
                    }}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedService === service.id
                        ? 'border-blue-600 bg-blue-50'
                        : errors.service
                        ? 'border-red-500'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{service.icon}</span>
                        <div>
                          <div className="font-semibold text-gray-900">{service.name}</div>
                          <div className="text-sm text-blue-600 font-medium">{service.price}</div>
                        </div>
                      </div>
                      {selectedService === service.id && (
                        <span className="text-blue-600">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {errors.service && (
                <p className="mt-1 text-sm text-red-500">{errors.service}</p>
              )}
            </div>

            {/* Date Selection */}
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                Select Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                required
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  if (errors.date) {
                    setErrors(prev => ({ ...prev, date: '' }));
                  }
                }}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-500">{errors.date}</p>
              )}
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Time <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      setSelectedTime(time);
                      if (errors.time) {
                        setErrors(prev => ({ ...prev, time: '' }));
                      }
                    }}
                    className={`py-2 px-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedTime === time
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : errors.time
                        ? 'border-red-500'
                        : 'border-gray-200 hover:border-blue-300 text-gray-700'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              {errors.time && (
                <p className="mt-1 text-sm text-red-500">{errors.time}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                Service Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                required
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) {
                    setErrors(prev => ({ ...prev, address: '' }));
                  }
                }}
                rows={3}
                placeholder="Enter the address where cleaning service is needed"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Any special instructions or requirements..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Documents (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="documents"
                  multiple
                  onChange={handleDocumentChange}
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                />
                <label
                  htmlFor="documents"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <span className="text-4xl">📎</span>
                  <span className="text-gray-600 font-medium">Click to upload documents</span>
                  <span className="text-sm text-gray-500">Images, PDF, or Documents (Max 10MB each)</span>
                </label>
              </div>
              {errors.documents && (
                <p className="mt-1 text-sm text-red-500">{errors.documents}</p>
              )}
              
              {/* Display uploaded files */}
              {documents.length > 0 && (
                <div className="mt-4 space-y-2">
                  {documents.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📄</span>
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Book Cleaning Service'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

