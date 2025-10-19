"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        // Simulate authentication by setting a flag in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        router.push('/'); // Redirect to home page/dashboard
      } catch (err) {
        setError('Failed to login. Please try again.');
      }
    } else {
      setError('Please fill in all fields');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-200 to-blue-100 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 space-y-8">
        <div className="flex flex-col items-center">
          <Image src="/images/logo.png" alt="Hapsaé Cleaning Services Logo" width={120} height={120} className="mb-2" style={{marginTop: 0, marginBottom: 8}} />
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-500 text-center">Sign in to your Hapsaé Cleaning Services account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900 text-base placeholder-gray-400 shadow-sm"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900 text-base placeholder-gray-400 shadow-sm pr-12"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute top-9 right-3 text-gray-400 hover:text-blue-600 focus:outline-none"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.197-6.263m1.414-1.414A9.96 9.96 0 0112 3c5.523 0 10 4.477 10 10a9.96 9.96 0 01-1.197 4.263m-1.414 1.414A10.05 10.05 0 0112 19c-1.02 0-2.01-.153-2.925-.438m-1.414-1.414A9.96 9.96 0 013 12c0-1.02.153-2.01.438-2.925m1.414-1.414A10.05 10.05 0 0112 5c1.02 0 2.01.153 2.925.438m1.414 1.414A9.96 9.96 0 0121 12c0 1.02-.153 2.01-.438 2.925m-1.414 1.414A10.05 10.05 0 0112 19c-1.02 0-2.01-.153-2.925-.438" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.22 4.22l15.56 15.56" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 shadow-md transition"
            >
              Sign in
            </button>
          </div>
          <div className="text-center pt-2">
            <a href="#" className="text-blue-600 hover:underline text-sm">Forgot password?</a>
          </div>
        </form>
      </div>
    </div>
  );
}