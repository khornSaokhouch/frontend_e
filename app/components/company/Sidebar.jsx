// app/components/company/Sidebar.jsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function Sidebar({ links }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white border-r border-slate-200">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <Link href="/" className="flex items-center gap-2">
           <svg className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
          <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <link.icon className={cn('h-5 w-5', isActive ? 'text-indigo-500' : 'text-slate-500')} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}