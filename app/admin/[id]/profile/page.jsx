"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserStore } from "../../../store/userStore";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  User,
  Mail,
  Loader2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast"; // Import the toast function

// A reusable Modal component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, isSubmitting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
        <h2 className="text-lg font-bold text-gray-800">Confirm Changes</h2>
        <p className="text-sm text-gray-600 mt-2 mb-6">
          Are you sure you want to save these changes to your profile?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-wait"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Yes, Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function EditProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading, fetchUserById, updateUser } = useUserStore();

  const [formData, setFormData] = useState({ name: "", image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (id) fetchUserById(id);
  }, [id, fetchUserById]);

  useEffect(() => {
    if (user) setFormData({ name: user.name || "", image: null });
  }, [user]);

  const getCleanImageUrl = (url) => {
    if (!url) return "/default-avatar.png";
    const lastHttpIndex = url.lastIndexOf("http");
    if (lastHttpIndex > 0) return url.substring(lastHttpIndex);
    return url;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true); // Open the confirmation modal instead of submitting directly
  };

  const handleConfirmUpdate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const loadingToast = toast.loading("Updating profile...");

    const data = new FormData();
    data.append("name", formData.name);
    if (formData.image) data.append("image", formData.image);
    data.append("_method", "POST");

    try {
      await updateUser(id, data);
      toast.success("Profile updated successfully!", { id: loadingToast });
      setIsModalOpen(false);
      // We don't need to redirect immediately, let the user see the success message.
      // The sidebar will re-fetch and update the user's name/image automatically.
      // router.push(`/profile/${id}/myprofile`);
    } catch (err) {
      toast.error(err.message || "Failed to update profile.", {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
      // If modal is still open, close it
      if (isModalOpen) setIsModalOpen(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg flex justify-center items-center h-96">
        <Loader2 className="animate-spin h-8 w-8 text-purple-600" />
      </div>
    );
  }

  const currentImageUrl = getCleanImageUrl(user.profile_image_url);

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        isSubmitting={isSubmitting}
      />
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Edit Information
        </h1>
        <p className="text-gray-500 mb-8">
          Make changes to your personal details and save them.
        </p>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="p-6 border rounded-lg bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-4">Profile Photo</h3>
            <div className="flex items-center gap-5">
              <div className="relative">
                <Image
                  src={imagePreview || currentImageUrl}
                  alt="Profile Preview"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover bg-gray-200"
                  unoptimized
                  priority
                />
                <label
                  htmlFor="image-upload"
                  className="absolute -bottom-1 -right-1 flex items-center justify-center w-8 h-8 bg-purple-600 rounded-full text-white cursor-pointer hover:bg-purple-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <input
                    id="image-upload"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">
                  Upload a new photo. A clear, recent photo is recommended.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-4">
              Account Details
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={user.email}
                    disabled
                    className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Link
              href={`/profile/${id}/myprofile`}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
