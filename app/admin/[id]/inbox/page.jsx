"use client";

import { useState, useEffect } from "react";
import {
  Pencil,
  Inbox,
  Star,
  Send,
  FileEdit,
  AlertOctagon,
  Bookmark,
  Trash2,
  Search,
  Archive,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNotificationsStore } from "../../../store/useNotificationsStore";
import { useCompanyStore } from "../../../store/useCompanyStore";
import toast, { Toaster } from "react-hot-toast"; // Import toast and Toaster

const EmailSidebar = ({ activeFolder, setActiveFolder, emailFolders }) => (
  <aside className="w-64 flex-shrink-0 border-r border-slate-200 p-4 flex flex-col">
    <button className="flex items-center justify-center gap-2 w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-colors">
      <Pencil className="w-5 h-5" />
      Compose
    </button>

    <div className="mt-6">
      <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase">
        My Email
      </h3>
      <nav className="mt-2 space-y-1 ">
        {emailFolders.map((folder) => {
          const isActive = activeFolder === folder.slug;
          return (
            <button
              key={folder.name}
              onClick={() => setActiveFolder(folder.slug)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <folder.icon
                  className={`w-5 h-5 ${
                    isActive ? "text-blue-600" : "text-slate-500"
                  }`}
                />
                <span>{folder.name}</span>
              </div>
              <span
                className={`text-xs font-bold ${
                  isActive ? "text-blue-700" : "text-slate-500"
                }`}
              >
                {folder.count.toLocaleString()}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  </aside>
);

const EmailListItem = ({ email, onSelect, isSelected }) => (
  <motion.div
    layout
    onClick={() => onSelect(email)}
    className={`flex items-center gap-4 p-3 border-b border-slate-200 cursor-pointer hover:bg-slate-50 transition-all duration-300 ${
      !email.isRead ? "bg-slate-50/50" : "bg-white"
    } ${isSelected ? "bg-blue-100 !border-blue-200 font-semibold" : ""}`}
  >
    <input
      type="checkbox"
      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
    />
    <button>
      <Star
        className={`w-5 h-5 ${
          email.isStarred
            ? "fill-yellow-400 text-yellow-500"
            : "text-slate-300 hover:text-yellow-400"
        }`}
      />
    </button>
    <div
      className={`w-40 truncate font-semibold ${
        !email.isRead ? "text-slate-800" : "text-slate-600"
      }`}
    >
      {email.sender}
    </div>
    <div
      className={`flex-1 truncate text-sm ${
        !email.isRead ? "text-slate-700" : "text-slate-500"
      }`}
    >
      {email.subject}
    </div>
    <div className="text-xs text-slate-500 w-20 text-right">{email.time}</div>
  </motion.div>
);

const EmailDetails = ({ email, onClose, handleAction }) => {
  if (!email) {
    return (
      <div className="p-6 text-center text-slate-500">
        Select an email to view details.
      </div>
    );
  }

  const data = email.data || {};
  const sellerStatus = data.status; // Get the status from email.data

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="p-6 border-t border-slate-200"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
              {data.company_name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <div className="font-semibold text-slate-700">{data.company_name}</div>
              <div className="text-xs text-slate-500">{data.email}</div>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-slate-800 mb-1">New Seller Request</h2>
          <div className="text-xs text-slate-500">
            {email.created_at
              ? new Date(email.created_at).toLocaleString()
              : "Unknown date"}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700">
            <Star className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Inbox
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <p className="text-slate-600">
          <strong>Message:</strong> {data.message || "No message"}
        </p>
        <p className="text-slate-600 mt-4">
          <strong>Name:</strong> {data.name} <br />
          <strong>Email:</strong> {data.email} <br />
          <strong>Company Name:</strong> {data.company_name}
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => handleAction("approved", data.seller_id)}
            className={`py-2 px-4 rounded ${
              sellerStatus === 'approved'
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white font-bold'
            }`}
            disabled={sellerStatus === 'approved'}
          >
            {sellerStatus === 'approved' ? 'Approved' : 'Approve Seller'}
          </button>
          <button
            onClick={() => handleAction("rejected", data.seller_id)}
            className={`py-2 px-4 rounded ${
              sellerStatus === 'rejected'
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white font-bold'
            }`}
            disabled={sellerStatus === 'rejected'}
          >
            {sellerStatus === 'rejected' ? 'Rejected' : 'Reject Seller'}
          </button>
        </div>


        <div className="text-center text-xs text-slate-500 mt-8">
          This notification relates to a new seller request. For more
          information, see the user’s profile.
        </div>
      </div>
    </motion.div>
  );
};


export default function InboxPage() {
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState(null);

  const { emails, loading, error, fetchNotifications } = useNotificationsStore();
  const { approveCompany, rejectCompany } = useCompanyStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleAction = async (action, sellerId) => {
    const loadingToast = toast.loading('Updating Email...');
    try {
      if (action === "approved") {
        await approveCompany(sellerId);
        setSelectedEmail(null);
        toast.success(`Seller ${sellerId} approved!`, { id: loadingToast }); // Using react-hot-toast
      } else if (action === "rejected") {
        await rejectCompany(sellerId);
        setSelectedEmail(null);
        toast.success(`Seller ${sellerId} rejected!`,{ id: loadingToast }); // Using react-hot-toast
      }
    } catch (err) {
      // console.error(`Error performing action ${action} for seller ${sellerId}:`, err);
      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        console.error("Error response headers:", err.response.headers);
      }
      toast.error(`Failed to ${action} seller: ${err.message}`); // Using react-hot-toast
    }
  };

  const emailFolders = [
    {
      name: "Inbox",
      slug: "inbox",
      icon: Inbox,
      count: emails.length,
    },
    {
      name: "Starred",
      slug: "starred",
      icon: Star,
      count: emails.filter((email) => email.isStarred).length,
    },
    {
      name: "Sent",
      slug: "sent",
      icon: Send,
      count: 0,
    },
    {
      name: "Draft",
      slug: "draft",
      icon: FileEdit,
      count: 0,
    },
    {
      name: "Spam",
      slug: "spam",
      icon: AlertOctagon,
      count: 0,
    },
    {
      name: "Important",
      slug: "important",
      icon: Bookmark,
      count: emails.filter((email) => email.isImportant).length || 0,
    },
    {
      name: "Bin",
      slug: "bin",
      icon: Trash2,
      count: 0,
    },
  ];

  const filteredEmails = emails.filter((email) => {
    switch (activeFolder) {
      case "starred":
        return email.isStarred;
      case "important":
        return email.isImportant;
      case "inbox":
      default:
        return true;
    }
  });

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
  };

  const handleCloseEmailDetails = () => {
    setSelectedEmail(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Inbox</h1>

      <div className="flex h-[75vh] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <EmailSidebar activeFolder={activeFolder} setActiveFolder={setActiveFolder} emailFolders={emailFolders} />

        <main className="flex-1 flex flex-col">
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
              <button className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700">
                <Archive className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700">
                <Info className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading && <div className="p-4 text-center text-slate-600">Loading emails...</div>}
            {error && <div className="p-4 text-center text-red-600">Error: {error}</div>}
            {!loading && !error && filteredEmails.length === 0 && (
              <div className="p-4 text-center text-slate-500">No emails found.</div>
            )}
            {!loading &&
              !error &&
              filteredEmails.map((email) => (
                <EmailListItem
                  key={email.id}
                  email={email}
                  onSelect={handleSelectEmail}
                  isSelected={selectedEmail?.id === email.id}
                />
              ))}
          </div>

          {selectedEmail && (
            <EmailDetails email={selectedEmail} onClose={handleCloseEmailDetails} handleAction={handleAction} />
          )}

          <div className="flex-shrink-0 flex items-center justify-between p-3 border-t border-slate-200">
            <span className="text-sm text-slate-600">
              Showing 1-{filteredEmails.length} of {emails.length.toLocaleString()}
            </span>
            <div className="flex items-center gap-1">
              <button
                className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                disabled
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
      {/* <Toaster /> Add the Toaster component here */}
    </div>
  );
}