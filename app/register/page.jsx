'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import Link from 'next/link';
import { User, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

// Reusable SVG icon for the logo.
const TechLogoIcon = (props) => (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <linearGradient id="registerLogoGradient" x1="12" y1="20" x2="28" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F472B6"/>
                <stop offset="1" stopColor="#A78BFA"/>
            </linearGradient>
        </defs>
        <path d="M12 10H28" stroke="url(#registerLogoGradient)" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M20 10V30" stroke="url(#registerLogoGradient)" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M16 30C16 27.7909 17.7909 26 20 26C22.2091 26 24 27.7909 24 30" stroke="url(#registerLogoGradient)" strokeWidth="3.5" strokeLinecap="round"/>
    </svg>
);


export default function RegisterPage() {
  const router = useRouter();
  const { register, loading } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    try {
      await register({
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      });
      
      toast.success('Registration successful! Please log in.');
      router.push('/login');

    } catch (err) {
      // The store handles API errors, but we can catch them here too.
      // Use toast for a better UX than alert().
      toast.error(err.message || 'Registration failed. Please try again.');
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
            <p className="text-gray-500 mt-2">Create your account to get started.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                </span>
                <input
                id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder='Enter Full Name'
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required disabled={loading}
                />
            </div>
          </div>

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
                  id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter Password'
                  className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required disabled={loading}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Enter Confirm Password'
                  className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required disabled={loading}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer">
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full flex justify-center items-center bg-purple-600 text-white py-2.5 rounded-md hover:bg-purple-700 disabled:bg-purple-400 transition-colors">
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Account'}
          </button>
        </form>

        {/* Sign in link */}
        <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-500">
                Log in
            </Link>
        </p>
      </div>
    </div>
  );
}