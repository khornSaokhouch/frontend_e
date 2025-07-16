"use client";

import { useEffect, useState, useMemo } from "react";
import { useUserStore } from "../../../store/userStore";
import Image from "next/image";
import {
  ShieldCheck,
  User,
  Search,
  ShieldAlert,
  Edit,
  X,
  Loader2,
  ChevronsUpDown,
  Trash2
} from "lucide-react";
import toast from "react-hot-toast";

function RoleBadge({ role }) {
  const roleConfig = {
    company: { label: "Company", classes: "bg-emerald-100 text-emerald-800", Icon: ShieldCheck },
    user: { label: "User", classes: "bg-blue-100 text-blue-800", Icon: User },
    default: { label: role, classes: "bg-gray-100 text-gray-800", Icon: User },
  };
  const { label, classes, Icon } = roleConfig[role] || roleConfig.default;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

// New Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-40 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-800">Confirm Deletion</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="mb-4 text-gray-700">
          Are you sure you want to delete user <strong>{userName}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const EditUserModal = ({ user, isOpen, onClose, onSave }) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || 'user');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) setSelectedRole(user.role);
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(user.id, selectedRole);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-opacity-40 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Edit User Role</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
            <Image
              src={user.cleanedImageUrl || '/default-avatar.png'}
              width={48}
              height={48}
              alt={user.name}
              className="rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              User Role
            </label>
            <div className="relative">
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full appearance-none rounded-md border-gray-300 py-2.5 px-3 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="user">User</option>
                <option value="company">Company</option>
              </select>
              <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 disabled:bg-purple-300"
            >
              {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Save Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function UsersPage() {
  const { users, loading, error, fetchAllUsers, updateUser, deleteUser } = useUserStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const getCleanImageUrl = (url) => {
    if (!url) return '/default-avatar.png';
    const lastHttpIndex = url.lastIndexOf('http');
    if (lastHttpIndex > 0) return url.substring(lastHttpIndex);
    return url;
  };

  const handleOpenModal = (user) => {
    const userWithCleanedImage = {
      ...user,
      cleanedImageUrl: getCleanImageUrl(user.profile_image_url),
    };
    setSelectedUser(userWithCleanedImage);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleSaveRole = async (userId, newRole) => {
    const loadingToast = toast.loading('Updating role...');
  
    const formData = new FormData();
    formData.append('role', newRole);
  
    try {
      await updateUser(userId, formData);
      toast.success('User role updated successfully!', { id: loadingToast });
      handleCloseModal();
      fetchAllUsers(); // <--- Refresh the list
    } catch (err) {
      toast.error(err.message || 'Failed to update role.', { id: loadingToast });
    }
  };
  

  const handleOpenConfirm = (user) => {
    setUserToDelete(user);
    setShowConfirmationModal(true);
  };

  const handleCloseConfirm = () => {
    setUserToDelete(null);
    setShowConfirmationModal(false);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    const { id, name } = userToDelete;
    

    
    const loadingToast = toast.loading('Deleting user...');
    handleCloseConfirm()
    try {
      await deleteUser(id);
      toast.success('User deleted successfully!', { id: loadingToast });
      fetchAllUsers(); // Refresh
    } catch (err) {
      toast.error(err.message || 'Failed to delete user.', { id: loadingToast });
    } finally {
      setUserToDelete(null);
      handleCloseConfirm()
    }
  };
  

  const nonAdminUsers = useMemo(() => users?.filter((u) => u.role !== 'admin') ?? [], [users]);
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return nonAdminUsers;
    const lower = search.toLowerCase();
    return nonAdminUsers.filter(
      (u) => u.name?.toLowerCase().includes(lower) || u.email?.toLowerCase().includes(lower)
    );
  }, [nonAdminUsers, search]);

  return (
    <>
      <EditUserModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveRole} user={selectedUser} />
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleCloseConfirm}
        onConfirm={handleDeleteUser}
        userName={userToDelete?.name}
      />
      <div className="space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Users</h1>
            <p className="mt-1 text-sm text-gray-500">View, search, and manage all users on the platform.</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border-gray-300 py-2 pl-9 pr-4 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </header>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined On
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && (
                  <tr>
                    <td colSpan="4" className="text-center py-10">
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-purple-600 rounded-full"></div>
                        Loading users...
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td colSpan="4" className="text-center py-10">
                      <div className="flex flex-col items-center justify-center gap-2 text-red-500">
                        <ShieldAlert className="w-8 h-8" />
                        <p className="font-semibold">Error loading users</p>
                        <p className="text-sm">{error}</p>
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && !error && filteredUsers.length > 0 && (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Image
                            src={getCleanImageUrl(user.profile_image_url)}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="text-purple-600 hover:text-purple-900"
                          aria-label={`Edit role of ${user.name}`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenConfirm(user)}
                          className="text-red-600 hover:text-red-800"
                          aria-label={`Delete user ${user.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
                {!loading && !error && filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-500">
                      No users match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}