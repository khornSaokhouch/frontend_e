import { Toaster } from 'react-hot-toast'; // ✅ 1. IMPORT THE TOASTER
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

// Font configuration
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'E-Commerces',
  description: 'A secure admin dashboard built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-gray-50 text-black`} // Added font-sans as a default
        suppressHydrationWarning
      >
        {/* ✅ 2. ADD THE TOASTER COMPONENT HERE */}
        <Toaster
          position="top-right"
          toastOptions={{
            // Define default options
            className: 'font-sans', // Ensure toasts use the same font
            duration: 5000,
            style: {
              background: '#ffffff',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            },
            // Default options for specific types
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981', // Green
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444', // Red
                secondary: '#ffffff',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}