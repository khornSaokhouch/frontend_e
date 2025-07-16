'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { Loader2 } from 'lucide-react'; // A clean spinner icon

// Reusable SVG icon for the logo, consistent with your other pages.
const TechLogoIcon = (props) => (
    <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <linearGradient id="loaderLogoGradient" x1="12" y1="20" x2="28" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F472B6"/>
                <stop offset="1" stopColor="#A78BFA"/>
            </linearGradient>
        </defs>
        <path d="M12 10H28" stroke="url(#loaderLogoGradient)" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M20 10V30" stroke="url(#loaderLogoGUI)" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M16 30C16 27.7909 17.7909 26 20 26C22.2091 26 24 27.7909 24 30" stroke="url(#loaderLogoGradient)" strokeWidth="3.5" strokeLinecap="round"/>
    </svg>
);

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loginWithToken } = useAuthStore();

  useEffect(() => {
    async function handleAuth() {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        router.push('/login?error=Authentication Failed');
        return;
      }

      if (token) {
        try {
          const user = await loginWithToken(token);
          if (user?.role === 'admin') {
            router.push(`/admin/${user.id}/dashboard`);
          } else if (user?.role === 'owner') { // Corrected role check from your code
            router.push(`/owner/${user.id}/bookings`);
          } else { // Default to user profile
            router.push(`/profile/${user.id}/myprofile`);
          }
        } catch (err) {
          router.push('/login?error=auth_failed');
        }
      } else {
        router.push('/login?error=no_token');
      }
    }

    handleAuth();
  }, [searchParams, loginWithToken, router]); // Dependency array updated for best practice

  // ✅ NEW: The polished loading screen UI
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
        <div className="flex items-center gap-3 mb-6">
            <TechLogoIcon />
            <span className="text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
                E-COMMERCES
            </span>
        </div>
      
        <div className="flex items-center text-lg text-gray-700">
            <Loader2 className="animate-spin h-6 w-6 mr-3 text-purple-600" />
            <span>Authenticating, please wait...</span>
        </div>
        <p className="text-sm text-gray-500 mt-4">
            Securing your session and redirecting you.
        </p>
    </div>
  );
}