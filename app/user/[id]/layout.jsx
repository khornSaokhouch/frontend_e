'use client';

import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';

export default function UserLayout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-6 py-10 md:px-8">
              {children}
            </div>
      <Footer />
    </div>
  );
}
