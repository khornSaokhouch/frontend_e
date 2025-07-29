"use client";
import React, { useEffect, useState, Fragment } from 'react';
import { usePaymentTypeStore } from '../../../store/usePaymentType';
import toast, { Toaster } from "react-hot-toast";

// --- Reusable Modal Component ---
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return <Fragment />;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

// --- Main Component ---
export default function PaymentTypeManager() {
  const {
    paymentTypes,
    fetchPaymentTypes,
    createPaymentType,
    updatePaymentType,
    deletePaymentType,
    loading,
    error,
  } = usePaymentTypeStore();

  const [modalState, setModalState] = useState({ type: null, data: null });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetchPaymentTypes();
  }, [fetchPaymentTypes]);

  const openModal = (type, data = null) => {
    setModalState({ type, data });
    if (type === 'edit' && data) {
      setInputValue(data.type);
    }
  };

  const closeModal = () => {
    setModalState({ type: null, data: null });
    setInputValue('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      toast.error('Type name is required.');
      return;
    }

    const toastId = toast.loading('Saving...');
    let result;
    
    if (modalState.type === 'add') {
      result = await createPaymentType({ type: inputValue.trim() });
      if (result) {
        toast.success('Payment type created successfully!', { id: toastId });
        closeModal();
      } else {
        toast.error('Failed to create payment type.', { id: toastId });
      }
    } else if (modalState.type === 'edit') {
      result = await updatePaymentType(modalState.data.id, { type: inputValue.trim() });
      if (result) {
        toast.success('Payment type updated successfully!', { id: toastId });
        closeModal();
      } else {
        toast.error('Failed to update payment type.', { id: toastId });
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (modalState.type === 'delete' && modalState.data) {
      const toastId = toast.loading('Deleting...');
      const result = await deletePaymentType(modalState.data.id);
      
      if (result) {
        toast.success('Payment type deleted successfully!', { id: toastId });
        closeModal();
      } else {
        toast.error('Failed to delete payment type.', { id: toastId });
      }
    }
  };
  
  const baseButton = "px-4 py-2 rounded-md font-semibold text-sm shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const primaryButton = `${baseButton} bg-emerald-600 text-white hover:bg-emerald-700`;
  const secondaryButton = `${baseButton} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50`;
  const destructiveButton = `${baseButton} bg-red-600 text-white hover:bg-red-700`;

  return (
    <>
      {/* 
        This is for react-hot-toast. 
        For best practice, move this to your root layout file (e.g., app/layout.js)
        so toasts are available globally.
      */}
      <Toaster position="top-right" />

      <div className="max-w-3xl mx-auto my-8 p-6 bg-gray-50 rounded-xl shadow-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800">Payment Types</h2>
          <button 
            className={primaryButton}
            onClick={() => openModal('add')}
            disabled={loading}
          >
            Add New Type
          </button>
        </div>

        {/* Global Error Message from Store */}
        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
            <strong>Error fetching data:</strong> {error}
          </div>
        )}

        {/* Loading State or List */}
        {loading && paymentTypes.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : (
          <ul className="space-y-3">
            {paymentTypes.map((pt) => (
              <li key={pt.id} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <span className="text-lg font-medium text-gray-700">{pt.type}</span>
                <div className="flex gap-2">
                  <button 
                    className={secondaryButton}
                    onClick={() => openModal('edit', pt)} 
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button 
                    className={`${baseButton} bg-red-50 text-red-700 hover:bg-red-100`}
                    onClick={() => openModal('delete', pt)} 
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* --- MODALS --- */}
      <Modal isOpen={modalState.type === 'add' || modalState.type === 'edit'} onClose={closeModal}>
        <form onSubmit={handleFormSubmit}>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {modalState.type === 'add' ? 'Add New Payment Type' : 'Edit Payment Type'}
          </h3>
          <div className="mb-6">
            <label htmlFor="paymentType" className="block text-sm font-medium text-gray-700 mb-1">
              Type Name
            </label>
            <input
              id="paymentType"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="e.g., Credit Card, PayPal"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" className={secondaryButton} onClick={closeModal} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className={primaryButton} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={modalState.type === 'delete'} onClose={closeModal}>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete the payment type: <strong className="font-medium text-gray-800">"{modalState.data?.type}"</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button type="button" className={secondaryButton} onClick={closeModal} disabled={loading}>
            Cancel
          </button>
          <button 
            type="button" 
            className={destructiveButton} 
            onClick={handleDeleteConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </>
  );
}