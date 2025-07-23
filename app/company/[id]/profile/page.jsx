"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LeftProfile from "../../../components/company/LeftProfile";
import RightForm from "../../../components/company/RightForm";
import { useCompanyInfoStore } from "../../../store/useCompanyInfoStore";
import { useUserStore } from "../../../store/userStore";
import { toast } from "react-hot-toast";

export default function CompanyProfilePage() {
  const { id } = useParams();

  const company = useCompanyInfoStore((state) => state.company);
  const loading = useCompanyInfoStore((state) => state.loading);
  const createCompany = useCompanyInfoStore((state) => state.createCompany);
  const updateCompany = useCompanyInfoStore((state) => state.updateCompany);
  const setFieldValue = useCompanyInfoStore((state) => state.setFieldValue);
  const fetchCompanyByUserId = useCompanyInfoStore((state) => state.fetchCompanyByUserId); // Make sure you have this

  const { fetchUserById, user, updateUser } = useUserStore();

  const [updating, setUpdating] = useState(false);

  const isNew = !company?.id;

  // Fetch user and company info
  useEffect(() => {
    if (id) {
      fetchUserById(id);
      fetchCompanyByUserId(id); // load company if editing
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, type, value, files } = e.target;
  
    if (type === "file") {
      const file = files && files[0] ? files[0] : null;
      setFieldValue(name, file); // ✅ this must be a File object
    } else {
      setFieldValue(name, value);
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isNew) {
        await createCompany(company);
        toast.success("Company created successfully!");
      } else {
        await updateCompany(company.id, company);
        toast.success("Company updated successfully!");
      }
    } catch (err) {
      console.error("Error saving company:", err);
      toast.error(err.message || "Failed to save company");
    }
  };

  const handleSaveProfile = async ({ name, imageFile }) => {
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) formData.append("image", imageFile);

      await updateUser(id, formData);
      toast.success("Profile updated");
      fetchUserById(id);
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleRevertChanges = () => {
    // Optional: implement reset logic from original state
    toast("Revert not implemented yet.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-xl font-bold mb-4">
        {isNew ? "Add New Company" : "Edit Company"}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <LeftProfile user={user} onSaveProfile={handleSaveProfile} />
        <RightForm
          companyData={company}
          handleInputChange={handleInputChange}
          loading={loading}
          revertChanges={handleRevertChanges}
          isNew={isNew}
        />
      </div>
    </form>
  );
}
