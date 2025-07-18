'use client';

import Link from 'next/link';

// Custom logo component to replicate the design
const Logo = () => (
  <div className="mb-12 flex items-center gap-3 px-2">
    {/* Recreating the icon with divs for a closer match */}
    <div className="relative h-9 w-9">
        <div className="absolute right-0 top-0 h-7 w-7 rounded-md bg-pink-300" />
        <div className="absolute bottom-0 left-0 h-7 w-7 rounded-md border-[3px] border-blue-600 bg-[#F4F7FF]" />
    </div>
    <span className="text-2xl font-bold text-slate-800">SeleDash.</span>
  </div>
);

export default function Sidebar({ links = [], pathname }) {
   return (
    <div className="flex h-full w-full flex-col bg-[#F4F7FF] p-6">
      <Logo />
      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 text-base transition-colors ${
                isActive
                  ? 'bg-white font-bold text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:bg-blue-100/50 hover:text-slate-800'
              }`}
            >
              <link.icon 
                className={`h-6 w-6 transition-colors ${ isActive ? 'text-blue-600' : 'text-gray-400'}`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}