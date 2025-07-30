// File: components/user/checkout/ManagePaymentMethodsModal.js

"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useUserPaymentMethodStore } from "../../../store/useUserPaymentMethod";
import { usePaymentTypeStore } from "../../../store/usePaymentType";
import { useUserStore } from "../../../store/userStore";

export default function ManagePaymentMethodsModal({ userId, onClose, onSuccess }) {
  const {
    userPaymentMethods,
    loading,
    error,
    fetchUserPaymentMethods,
    createUserPaymentMethod,
    deleteUserPaymentMethod,
  } = useUserPaymentMethodStore();

  const { paymentTypes, fetchPaymentTypes } = usePaymentTypeStore();
  const { user } = useUserStore();

  const [formData, setFormData] = useState({
    user_id: userId || user?.id || "",
    payment_type_id: "",
    provider: "",
    card_number: "",
    expiry_month: "",
    expiry_year: "",
  });

  // Fetch data when the modal opens
  useEffect(() => {
    const currentUserId = userId || user?.id;
    if (currentUserId) {
      fetchUserPaymentMethods(currentUserId);
    }
    fetchPaymentTypes();
  }, [userId, user, fetchUserPaymentMethods, fetchPaymentTypes]);

  // Display API errors from the store
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    for (const key in formData) {
      if (!formData[key]) {
        toast.error(`Please fill out the ${key.replace(/_/g, " ")} field.`);
        return;
      }
    }
    const expiryDateISO = `${formData.expiry_year}-${formData.expiry_month}-01`;
    const dataToSubmit = {
      user_id: formData.user_id,
      payment_type_id: Number(formData.payment_type_id),
      provider: formData.provider,
      card_number: formData.card_number,
      expiry_date: expiryDateISO,
    };
    
    const newPaymentMethod = await createUserPaymentMethod(dataToSubmit);
    if (newPaymentMethod) {
      toast.success("Payment method added successfully!");
      setFormData({ // Reset form after successful creation
        ...formData, payment_type_id: "", provider: "", card_number: "", expiry_month: "", expiry_year: ""
      });
      onSuccess?.(); // Notify parent to refresh its list
    }
  };

  const handleDelete = (paymentMethodId) => {
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-3">
          <span className="text-center font-medium">Delete this payment method?</span>
          <div className="flex gap-4">
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded text-sm"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await deleteUserPaymentMethod(paymentMethodId);
                  toast.success('Method deleted successfully!');
                  onSuccess?.();
                } catch (err) {
                  toast.error('Failed to delete the method.');
                }
              }}
            >
              Delete
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-4 rounded text-sm"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  };

  const months = Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString().padStart(2, '0'), label: (i + 1).toString().padStart(2, '0') }));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear + i);

  return (
    <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Manage Payment Methods</h2>
          <button className="text-gray-400 hover:text-gray-600" onClick={onClose} aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Saved Methods</h3>
          <div className="space-y-3 max-h-40 overflow-y-auto pr-2 mb-6">
            {userPaymentMethods.length > 0 ? (
              userPaymentMethods.map((pm) => (
                <div key={pm.id} className="flex justify-between items-center text-sm border border-gray-200 px-4 py-3 rounded-md">
                  <div>
                    <span className="font-medium text-gray-900">{pm.provider}</span>
                    <span className="text-gray-600"> — ending in {pm.card_number?.slice(-4)}</span>
                  </div>
                  <button className="text-red-500 hover:text-red-700 text-xs font-semibold" onClick={() => handleDelete(pm.id)}>DELETE</button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">You have no saved payment methods.</p>
            )}
          </div>
          
          <hr className="my-6 border-gray-200" />
          
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add a New Method</h3>
          <form onSubmit={handleCreate} className="space-y-4">
             <select name="payment_type_id" value={formData.payment_type_id} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400" required>
                <option value="">Select Payment Type</option>
                {paymentTypes.map((type) => (<option key={type.id} value={type.id}>{type.type}</option>))}
             </select>
             <input type="text" name="provider" placeholder="Card Provider (e.g., Visa)" value={formData.provider} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400" required/>
             <input type="text" name="card_number" placeholder="Card Number" maxLength="19" value={formData.card_number} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400" required/>
             <div className="grid grid-cols-2 gap-4">
                <select name="expiry_month" value={formData.expiry_month} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400" required>
                   <option value="">Month</option>
                   {months.map(month => (<option key={month.value} value={month.value}>{month.label}</option>))}
                </select>
                <select name="expiry_year" value={formData.expiry_year} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400" required>
                   <option value="">Year</option>
                   {years.map(year => (<option key={year} value={year}>{year}</option>))}
                </select>
             </div>
             <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-md hover:bg-gray-200">Close</button>
                <button type="submit" className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md disabled:opacity-50" disabled={loading}>
                   {loading ? "Saving..." : "Save Card"}
                </button>
             </div>
          </form>
        </div>
      </div>
    </div>
  );
}