"use client";

import { useState } from 'react';
import {
  Pencil,
  Inbox,
  Star,
  Send,
  FileEdit,
  AlertOctagon,
  Bookmark,
  Trash2,
  Plus,
  Search,
  Archive,
  Info,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// --- MOCK DATA (Replace with your API data) ---

const emailFolders = [
  { name: 'Inbox', slug: 'inbox', icon: Inbox, count: 1253 },
  { name: 'Starred', slug: 'starred', icon: Star, count: 245 },
  { name: 'Sent', slug: 'sent', icon: Send, count: 24532 },
  { name: 'Draft', slug: 'draft', icon: FileEdit, count: 9 },
  { name: 'Spam', slug: 'spam', icon: AlertOctagon, count: 14 },
  { name: 'Important', slug: 'important', icon: Bookmark, count: 18 },
  { name: 'Bin', slug: 'bin', icon: Trash2, count: 9 },
];

const emailLabels = [
  { name: 'Primary', color: 'bg-blue-400' },
  { name: 'Social', color: 'bg-sky-400' },
  { name: 'Work', color: 'bg-orange-400' },
  { name: 'Friends', color: 'bg-purple-400' },
];

const emails = [
    { id: 1, sender: 'Jullu Jalal', subject: 'Our Bachelor of Commerce program is ACBSP-accredited.', time: '8:38 AM', isStarred: true, isRead: false },
    { id: 2, sender: 'Minerva Barnett', subject: 'Get Best Advertiser In Your Side Pocket', time: '8:13 AM', isStarred: true, isRead: false },
    { id: 3, sender: 'Peter Lewis', subject: 'Vacation Home Rental Success', time: '7:52 PM', isStarred: true, isRead: true },
    { id: 4, sender: 'Anthony Briggs', subject: 'Free Classifieds Using Them To Promote Your Stuff Online', time: '7:52 PM', isStarred: true, isRead: true },
    { id: 5, sender: 'Clifford Morgan', subject: 'Enhance Your Brand Potential With Giant Advertising Blimps', time: '4:13 PM', isStarred: true, isRead: true },
    { id: 6, sender: 'Cecilia Webster', subject: 'Always Look On The Bright Side Of Life', time: '3:52 PM', isStarred: true, isRead: true },
    { id: 7, sender: 'Harvey Manning', subject: 'Curling Irons Are As Individual As The Women Who Use Them', time: '2:30 PM', isStarred: true, isRead: true },
    { id: 8, sender: 'Willie Blake', subject: 'Our Bachelor of Commerce program is ACBSP-accredited.', time: '8:38 AM', isStarred: false, isRead: true },
    { id: 9, sender: 'Minerva Barnett', subject: 'Get Best Advertiser In Your Side Pocket', time: '8:13 AM', isStarred: false, isRead: true },
    { id: 10, sender: 'Fanny Weaver', subject: 'Free Classifieds Using Them To Promote Your Stuff Online', time: '7:52 PM', isStarred: false, isRead: true },
    { id: 11, sender: 'Olga Hogan', subject: 'Enhance Your Brand Potential With Giant Advertising Blimps', time: '4:13 PM', isStarred: false, isRead: true },
    { id: 12, sender: 'Lora Houston', subject: 'Vacation Home Rental Success', time: '7:52 PM', isStarred: false, isRead: true },
];

// --- SUB-COMPONENTS ---

/**
 * The left sidebar for navigation and labels.
 */
const EmailSidebar = ({ activeFolder, setActiveFolder }) => (
  <aside className="w-64 flex-shrink-0 border-r border-slate-200 p-4 flex flex-col">
    <button className="flex items-center justify-center gap-2 w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-colors">
      <Pencil className="w-5 h-5" />
      Compose
    </button>

    <div className="mt-6">
      <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase">My Email</h3>
      <nav className="mt-2 space-y-1 ">
        {emailFolders.map((folder) => {
          const isActive = activeFolder === folder.slug;
          return (
            <button
              key={folder.name}
              onClick={() => setActiveFolder(folder.slug)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <folder.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                <span>{folder.name}</span>
              </div>
              <span className={`text-xs font-bold ${isActive ? 'text-blue-700' : 'text-slate-500'}`}>{folder.count.toLocaleString()}</span>
            </button>
          );
        })}
      </nav>
    </div>

    <div className="mt-4">
      <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase">Label</h3>
      <nav className="mt-2 space-y-2">
        {emailLabels.map((label) => (
          <button key={label.name} className="w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100">
            <div className={`w-2.5 h-2.5 rounded-sm ${label.color}`} />
            <span>{label.name}</span>
          </button>
        ))}
      </nav>
    </div>
    
    <button className="mt-4 flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100">
      <Plus className="w-5 h-5 text-slate-500" />
      Create New Label
    </button>
  </aside>
);

/**
 * A single email row in the list.
 */
const EmailListItem = ({ email }) => (
  <div className={`flex items-center gap-4 p-3 border-b border-slate-200 cursor-pointer hover:bg-slate-50 ${!email.isRead ? 'bg-slate-50/50' : 'bg-white'}`}>
    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
    <button>
      <Star className={`w-5 h-5 ${email.isStarred ? 'fill-yellow-400 text-yellow-500' : 'text-slate-300 hover:text-yellow-400'}`} />
    </button>
    <div className={`w-40 truncate font-semibold ${!email.isRead ? 'text-slate-800' : 'text-slate-600'}`}>
      {email.sender}
    </div>
    <div className={`flex-1 truncate text-sm ${!email.isRead ? 'text-slate-700' : 'text-slate-500'}`}>
      {email.subject}
    </div>
    <div className="text-xs text-slate-500 w-20 text-right">
      {email.time}
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---

export default function InboxPage() {
  const [activeFolder, setActiveFolder] = useState('starred');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Inbox</h1>
      
      <div className="flex h-[75vh] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Left Sidebar */}
        <EmailSidebar activeFolder={activeFolder} setActiveFolder={setActiveFolder} />

        {/* Main Content: Email List */}
        <main className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-slate-200">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search mail"
                className="w-full bg-slate-100 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"><Archive className="w-5 h-5" /></button>
              <button className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"><Info className="w-5 h-5" /></button>
              <button className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"><Trash2 className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto">
            {emails.map(email => (
              <EmailListItem key={email.id} email={email} />
            ))}
          </div>

          {/* Pagination Footer */}
          <div className="flex-shrink-0 flex items-center justify-between p-3 border-t border-slate-200">
            <span className="text-sm text-slate-600">
              Showing 1-12 of 1,253
            </span>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50" disabled>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}