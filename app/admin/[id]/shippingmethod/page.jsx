"use client";
import React, { useEffect, useState, Fragment } from 'react';
import { useShippingMethodStore } from '../../../store/useShippingMethod';
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
export default function ShippingMethodManager() {
  const {
    shippingMethods,
    fetchShippingMethods,
    createShippingMethod,
    updateShippingMethod,
    deleteShippingMethod,
    loading,
    error,
  } = useShippingMethodStore();

  const [modalState, setModalState] = useState({ type: null, data: null });
  
  // State to hold form values for both name and price
  const [formValues, setFormValues] = useState({ name: '', price: '' });

  useEffect(() => {
    fetchShippingMethods();
  }, [fetchShippingMethods]);

  const openModal = (type, data = null) => {
    setModalState({ type, data });
    // If editing, pre-fill the form with existing data
    if (type === 'edit' && data) {
      setFormValues({ name: data.name, price: data.price });
    }
  };

  const closeModal = () => {
    setModalState({ type: null, data: null });
    // Reset form values on close
    setFormValues({ name: '', price: '' });
  };

  // Generic handler for form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { name, price } = formValues;

    // Validation
    if (!name.trim()) {
      return toast.error('Method name is required.');
    }
    if (price === '' || isNaN(price) || Number(price) < 0) {
      return toast.error('Please enter a valid, non-negative price.');
    }

    const toastId = toast.loading('Saving...');
    const payload = { name: name.trim(), price: Number(price) };
    let result;

    if (modalState.type === 'add') {
      result = await createShippingMethod(payload);
      if (result) {
        toast.success('Shipping method created!', { id: toastId });
        closeModal();
      } else {
        toast.error('Failed to create method.', { id: toastId });
      }
    } else if (modalState.type === 'edit') {
      result = await updateShippingMethod(modalState.data.id, payload);
      if (result) {
        toast.success('Shipping method updated!', { id: toastId });
        closeModal();
      } else {
        toast.error('Failed to update method.', { id: toastId });
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (modalState.type === 'delete' && modalState.data) {
      const toastId = toast.loading('Deleting...');
      const result = await deleteShippingMethod(modalState.data.id);
      
      if (result) {
        toast.success('Method deleted successfully!', { id: toastId });
        closeModal();
      } else {
        toast.error('Failed to delete method.', { id: toastId });
      }
    }
  };
  
  const baseButton = "px-4 py-2 rounded-md font-semibold text-sm shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const primaryButton = `${baseButton} bg-sky-600 text-white hover:bg-sky-700`;
  const secondaryButton = `${baseButton} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50`;
  const destructiveButton = `${baseButton} bg-red-600 text-white hover:bg-red-700`;

  return (
    <>
      {/* For best practice, move this to your root layout file (e.g., app/layout.js) */}
      <Toaster position="top-right" />

      <div className="max-w-3xl mx-auto my-8 p-6 bg-gray-50 rounded-xl shadow-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800">Shipping Methods</h2>
          <button 
            className={primaryButton}
            onClick={() => openModal('add')}
            disabled={loading}
          >
            Add New Method
          </button>
        </div>

        {/* Global Error Message from Store */}
        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
            <strong>Error fetching data:</strong> {error}
          </div>
        )}

        {/* Loading State or List */}
        {loading && shippingMethods.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : (
          <ul className="space-y-3">
            {shippingMethods.map((sm) => (
              <li key={sm.id} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex flex-col">
                    <span className="text-lg font-medium text-gray-800">{sm.name}</span>
                    <span className="text-sm text-gray-500">${Number(sm.price).toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className={secondaryButton}
                    onClick={() => openModal('edit', sm)} 
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button 
                    className={`${baseButton} bg-red-50 text-red-700 hover:bg-red-100`}
                    onClick={() => openModal('delete', sm)} 
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
            {modalState.type === 'add' ? 'Add New Shipping Method' : 'Edit Shipping Method'}
          </h3>
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Method Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="e.g., Standard Shipping"
                value={formValues.name}
                onChange={handleInputChange}
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="0.00"
                value={formValues.price}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" className={secondaryButton} onClick={closeModal} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className={primaryButton} disabled={loading}>
              {loading ? 'Saving...' : 'Save Method'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={modalState.type === 'delete'} onClose={closeModal}>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete the shipping method: <strong className="font-medium text-gray-800">"{modalState.data?.name}"</strong>? This action is permanent.
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