'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import Link from 'next/link';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'; // Import Eye and EyeOff icons

// Reusable SVG icon for the logo.
const TechLogoIcon = (props) => (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <linearGradient id="loginLogoGradient" x1="12" y1="20" x2="28" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F472B6"/>
                <stop offset="1" stopColor="#A78BFA"/>
            </linearGradient>
        </defs>
        <path d="M12 10H28" stroke="url(#loginLogoGradient)" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M20 10V30" stroke="url(#loginLogoGradient)" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M16 30C16 27.7909 17.7909 26 20 26C22.2091 26 24 27.7909 24 30" stroke="url(#loginLogoGradient)" strokeWidth="3.5" strokeLinecap="round"/>
    </svg>
);


export default function LoginPage() {
  const router = useRouter();
  const { login, error, loading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  
  // ✅ 1. Add state to manage password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    try {
      const { user } = await login(email, password);
      if (user.role === 'admin') {
        router.push(`/admin/${user.id}/dashboard`);
      } else if (user.role === 'company') {
        router.push(`/company/${user.id}/dashboard`);
      } else {
        router.push(`/`);
      }
    } catch (err) {
      setLocalError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="p-6 sm:p-10 bg-white rounded-xl shadow-lg w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
                <TechLogoIcon className="h-9 w-9" />
                <span className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
                    E-COMMERCES
                </span>
            </Link>
            <p className="text-gray-500 mt-2">Welcome back! Please sign in to your account.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                </span>
                <input
                id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter Email'
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required disabled={loading}
                />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  // ✅ 2. Toggle the input type based on state
                  id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter Password'
                  className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required disabled={loading}
                />
                {/* ✅ 3. Add the toggle button */}
                <button
                  type="button" // Important to prevent form submission
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </div>
          </div>
          
          {(localError || error) && (
            <p className="text-red-500 text-sm">{localError || error}</p>
          )}

          <button type="submit" disabled={loading} className="w-full flex justify-center items-center bg-purple-600 text-white py-2.5 rounded-md hover:bg-purple-700 disabled:bg-purple-400 transition-colors">
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Login with Google */}
        <div className="text-center">
          <a
            href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/redirect`}
            className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 48 48">
              <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
            </svg>
            Login with Google
          </a>
        </div>
        
        {/* Sign up link */}
        <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-purple-600 hover:text-purple-500">
               Register
            </Link>
        </p>
      </div>
    </div>
  );
}