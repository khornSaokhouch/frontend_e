'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

// Icons for a polished and intuitive form
import { 
  UserIcon, 
  AtSymbolIcon, 
  LockClosedIcon, 
  ExclamationCircleIcon 
} from '@heroicons/react/24/solid';


/**
 * Reusable, animated alert for global form errors.
 */
function AuthAlert({ message }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
      className="flex items-center gap-3 rounded-md bg-red-50 p-3 text-sm text-red-700"
    >
      <ExclamationCircleIcon className="h-5 w-5" />
      <span>{message}</span>
    </motion.div>
  );
}

/**
 * Reusable, animated component for individual field errors.
 */
function FieldError({ message }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="mt-1.5 flex items-center gap-1 text-xs text-red-600"
    >
      <ExclamationCircleIcon className="h-4 w-4" />
      {message}
    </motion.p>
  );
}

export default function Register() {
  const router = useRouter();
  const { register, loading, error: globalError, fieldErrors, clearErrors } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');


const handleSubmit = async (e) => {
  e.preventDefault();
  setLocalError('');

  if (password !== confirmPassword) {
    setLocalError('Passwords do not match.');
    return;
  }

  if (password.length < 8) {
    setLocalError('Password must be at least 8 characters long.');
    return;
  }

  try {
    const success = await register({
      name,
      email,
      password,
      password_confirmation: confirmPassword, // ✅ important mapping
    });
    

    if (success) {
      router.push('/login');
    }
  } catch (err) {
    // The Zustand store logs and sets the global error,
    // but you can also catch and show it locally if you want:
    console.error('Registration failed on client:', err);
    setLocalError(err.message);
  }
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* App Logo/Name */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Create an Account</h1>
          <p className="mt-2 text-lg text-gray-400">Join us and get started.</p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl p-8 space-y-5"
          noValidate
        >
          <AnimatePresence>
            {(localError || globalError) && <AuthAlert message={localError || globalError} />}
          </AnimatePresence>

          {/* Name Input */}
          <div>
            <label htmlFor="name" className="sr-only">Full name</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                className="w-full rounded-md border-gray-300 py-3 pl-10 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>
            <AnimatePresence><FieldError message={fieldErrors?.name?.[0]} /></AnimatePresence>
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <AtSymbolIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-md border-gray-300 py-3 pl-10 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <AnimatePresence><FieldError message={fieldErrors?.email?.[0]} /></AnimatePresence>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full rounded-md border-gray-300 py-3 pl-10 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Password (min. 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <AnimatePresence><FieldError message={fieldErrors?.password?.[0]} /></AnimatePresence>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="w-full rounded-md border-gray-300 py-3 pl-10 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Account...
              </>
            ) : 'Sign Up'}
          </button>
        </motion.form>

       
<p className="text-center text-sm text-gray-400">
  Already have an account?{' '}
  {/* THIS IS THE CORRECTED PART */}
  <Link 
    href="/login"
    className="font-medium text-indigo-400 hover:text-indigo-300"
  >
    Sign in
  </Link>
</p>
      </div>
    </div>
  );
}