"use client";
import React, { useEffect, useState, Fragment } from 'react';
import { useOrderStatusStore } from "../../../store/useOrderStatus";
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
export default function OrderStatusManager() {
  const {
    orderStatuses,
    fetchOrderStatuses,
    createOrderStatus,
    updateOrderStatus,
    deleteOrderStatus,
    loading,
    error,
  } = useOrderStatusStore();

  const [modalState, setModalState] = useState({ type: null, data: null });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetchOrderStatuses();
  }, [fetchOrderStatuses]);

  const openModal = (type, data = null) => {
    setModalState({ type, data });
    if (type === 'edit' && data) {
      setInputValue(data.status);
    }
  };

  const closeModal = () => {
    setModalState({ type: null, data: null });
    setInputValue('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      return toast.error('Status name is required.');
    }

    const toastId = toast.loading('Saving...');
    const payload = { status: inputValue.trim() };
    let result;
    
    if (modalState.type === 'add') {
      result = await createOrderStatus(payload);
      if (result) {
        toast.success('Order status created!', { id: toastId });
        closeModal();
      } else {
        toast.error('Failed to create status.', { id: toastId });
      }
    } else if (modalState.type === 'edit') {
      result = await updateOrderStatus(modalState.data.id, payload);
      if (result) {
        toast.success('Order status updated!', { id: toastId });
        closeModal();
      } else {
        toast.error('Failed to update status.', { id: toastId });
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (modalState.type === 'delete' && modalState.data) {
      const toastId = toast.loading('Deleting...');
      const result = await deleteOrderStatus(modalState.data.id);
      
      if (result) {
        toast.success('Status deleted successfully!', { id: toastId });
        closeModal();
      } else {
        toast.error('Failed to delete status.', { id: toastId });
      }
    }
  };
  
  const baseButton = "px-4 py-2 rounded-md font-semibold text-sm shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const primaryButton = `${baseButton} bg-amber-500 text-white hover:bg-amber-600`;
  const secondaryButton = `${baseButton} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50`;
  const destructiveButton = `${baseButton} bg-red-600 text-white hover:bg-red-700`;

  return (
    <>
      {/* For best practice, move this to your root layout file (e.g., app/layout.js) */}
      <Toaster position="top-right" />

      <div className="max-w-3xl mx-auto my-8 p-6 bg-gray-50 rounded-xl shadow-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800">Order Statuses</h2>
          <button 
            className={primaryButton}
            onClick={() => openModal('add')}
            disabled={loading}
          >
            Add New Status
          </button>
        </div>

        {/* Global Error Message from Store */}
        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
            <strong>Error fetching data:</strong> {error}
          </div>
        )}

        {/* Loading State or List */}
        {loading && orderStatuses.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : (
          <ul className="space-y-3">
            {orderStatuses.map((os) => (
              <li key={os.id} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <span className="text-lg font-medium text-gray-700">{os.status}</span>
                <div className="flex gap-2">
                  <button 
                    className={secondaryButton}
                    onClick={() => openModal('edit', os)} 
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button 
                    className={`${baseButton} bg-red-50 text-red-700 hover:bg-red-100`}
                    onClick={() => openModal('delete', os)} 
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
            {modalState.type === 'add' ? 'Add New Order Status' : 'Edit Order Status'}
          </h3>
          <div className="mb-6">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status Name
            </label>
            <input
              id="status"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="e.g., Pending, Shipped, Delivered"
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
              {loading ? 'Saving...' : 'Save Status'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={modalState.type === 'delete'} onClose={closeModal}>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete the order status: <strong className="font-medium text-gray-800">"{modalState.data?.status}"</strong>? This action cannot be undone.
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