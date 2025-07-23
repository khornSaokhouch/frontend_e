"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Edit, UploadCloud, Save, X } from "lucide-react";

const LeftProfile = ({ user, onSaveProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imagePreview, setImagePreview] = useState("/default-avatar.png");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setImagePreview(user?.profile_image_url || "/default-avatar.png");
    setImageFile(null);
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSaveProfile?.({ name, imageFile });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(user?.name || "");
    setImagePreview(user?.profile_image_url || "/default-avatar.png");
    setImageFile(null);
  };

  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-md text-center relative">
      <div className="relative w-32 h-32 mx-auto mb-4">
  <Image
    src={imagePreview}
    alt="Profile"
    fill
    sizes="(max-width: 768px) 128px, 256px"
    className="rounded-full object-cover border-4 border-white shadow-md"
  />
</div>


        <div className="space-y-2">
          {isEditing ? (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter name"
              />
              <label className="block cursor-pointer mt-3 text-blue-600 text-sm hover:underline">
                <UploadCloud className="inline-block w-4 h-4 mr-1" />
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
              <p className="text-sm text-gray-500">{email}</p>
            </>
          )}
        </div>

        <div className="mt-6">
          {isEditing ? (
            <div className="flex justify-center gap-3">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white flex items-center gap-1 px-4 py-2 text-sm rounded-md shadow hover:bg-blue-700 transition"
              >
                <Save className="w-4 h-4" /> Save
              </button>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-red-500 flex items-center gap-1 text-sm"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex justify-center items-center gap-2 px-4 py-2 mt-4 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              <Edit className="w-4 h-4" /> Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftProfile;
