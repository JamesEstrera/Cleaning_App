'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
    'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1920&q=80',
    'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=1920&q=80'
  ];

  // HERO IMAGE TRANSITION (fade + 7 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // AUTH CHECK
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
    { title: 'House Cleaning', description: 'Complete home cleaning service including dusting, vacuuming, and sanitizing.', icon: '🏠' },
    { title: 'Office Cleaning', description: 'Professional cleaning services for offices and commercial spaces.', icon: '🏢' },
    { title: 'Deep Cleaning', description: 'Thorough deep cleaning service for those extra dirty spaces.', icon: '✨' },
    { title: 'Move In/Out Cleaning', description: 'Specialized cleaning service for moving transitions.', icon: '📦' }
  ];

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('profileData');
    router.push('/login');
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

      <div className="min-h-screen ml-70">

        {/* Main Content */}
        <main className="pt-6">

          {/* HERO SECTION (unchanged except smoother fade) */}
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-24 overflow-hidden">
            <div className="absolute inset-0">
              {heroImages.map((img, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
              ))}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-blue-800/70"></div>

            <div className="relative z-10 text-center max-w-7xl mx-auto px-4">
              <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                ✨ Trusted by 10,000+ Happy Customers
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
                Professional Cleaning <span className="block text-blue-200">Services</span>
              </h1>

              <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-2xl mx-auto">
                Experience the sparkle with our expert cleaning team!
              </p>

              <Link href="/booking">
                <button className="bg-white text-blue-600 px-12 py-5 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-xl hover:scale-105">
                  Book a Cleaning
                </button>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white py-16 border-y border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
                  <div className="text-gray-600 font-medium">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
                  <div className="text-gray-600 font-medium">Cleanings Done</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">4.9★</div>
                  <div className="text-gray-600 font-medium">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                  <div className="text-gray-600 font-medium">Support Available</div>
                </div>
                </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-10 md:p-16 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to experience a cleaner space?</h2>
                  <p className="text-xl md:text-2xl mb-8 text-blue-100">Book your first cleaning service today and get 20% off!</p>
                  <Link href="/booking">
                    <button className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform">
                      Get Started Now
                </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Services</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive cleaning solutions tailored to your needs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <div 
                  key={index} 
                  className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300 hover:-translate-y-2"
                >
                  <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <Link href="/booking">
                      <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2 group-hover:gap-3 transition-all">
                        Learn More
                        <span>→</span>
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Image src="/images/logo.png" alt="logo" width={40} height={40} className="object-contain" />
                    <div className="text-xl font-bold text-white">Hapsaé</div>
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    Professional cleaning services for your home and office. Making spaces sparkle since 2020.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4 text-white">Services</h3>
                  <ul className="space-y-2">
                    <li><a href="/booking" className="text-gray-400 hover:text-white transition-colors">House Cleaning</a></li>
                    <li><a href="/booking" className="text-gray-400 hover:text-white transition-colors">Office Cleaning</a></li>
                    <li><a href="/booking" className="text-gray-400 hover:text-white transition-colors">Deep Cleaning</a></li>
                    <li><a href="/booking" className="text-gray-400 hover:text-white transition-colors">Move In/Out</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4 text-white">Contact</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-center gap-2">
                      <span>📧</span>
                      <span>info@hapsae.com</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>📞</span>
                      <span>(555) 123-4567</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>📍</span>
                      <span>123 Service St, City</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4 text-white">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                      <span className="text-lg">f</span>
                    </a>
                    <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                      <span className="text-lg">t</span>
                    </a>
                    <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                      <span className="text-lg">in</span>
                    </a>
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t border-gray-700 text-center text-gray-400">
                <p>&copy; 2025 Hapsaé Cleaning Services. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}