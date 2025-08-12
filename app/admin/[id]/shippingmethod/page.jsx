"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useShippingMethodStore } from '../../../store/useShippingMethod';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

// --- Import New Components ---
import ShippingMethodHeader from '../../../components/admin/shipping/ShippingMethodHeader';
import ShippingMethodTable from '../../../components/admin/shipping/ShippingMethodTable';
import ShippingMethodFormModal from '../../../components/admin/shipping/ShippingMethodFormModal';
import DeleteConfirmationModal from '../../../components/admin/shipping/DeleteConfirmationModal'; // Generic modal
import LoadingState from '../../../components/admin/shipping/LoadingState';
import EmptyState from '../../../components/admin/shipping/EmptyState';
import ErrorState from '../../../components/admin/shipping/ErrorState';

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

  // Initial data fetch
  useEffect(() => {
    fetchShippingMethods();
  }, [fetchShippingMethods]);

  // Handlers to open/close modals
  const openModal = (type, data = null) => setModalState({ type, data });
  const closeModal = () => setModalState({ type: null, data: null });

  // Form submission handler (Create/Update)
  const handleFormSubmit = async (formData) => {
    const { name, price } = formData;
    const toastId = toast.loading('Saving...');
    const payload = { name: name.trim(), price: Number(price) };
    let result;

    if (modalState.type === 'add') {
      result = await createShippingMethod(payload);
    } else if (modalState.type === 'edit') {
      result = await updateShippingMethod(modalState.data.id, payload);
    }

    if (result) {
      toast.success(`Shipping method ${modalState.type === 'add' ? 'created' : 'updated'}!`, { id: toastId });
      closeModal();
    } else {
      toast.error('Operation failed. Please try again.', { id: toastId });
    }
  };

  // Delete confirmation handler
  const handleDeleteConfirm = async () => {
    const { id } = modalState.data;
    const toastId = toast.loading('Deleting...');
    const result = await deleteShippingMethod(id);

    if (result) {
      toast.success('Method deleted successfully!', { id: toastId });
      closeModal();
    } else {
      toast.error('Failed to delete method.', { id: toastId });
    }
  };

  const renderContent = () => {
    if (loading && shippingMethods.length === 0) {
      return <LoadingState message="Fetching shipping methods..." />;
    }
    if (error) {
      return <ErrorState message={error} onRetry={fetchShippingMethods} />;
    }
    if (shippingMethods.length === 0) {
      return <EmptyState item="shipping method" onAddClick={() => openModal('add')} />;
    }
    return (
      <ShippingMethodTable
        methods={shippingMethods}
        onEdit={(method) => openModal('edit', method)}
        onDelete={(method) => openModal('delete', method)}
        isProcessing={loading}
      />
    );
  };
  
  const isFormModalOpen = modalState.type === 'add' || modalState.type === 'edit';
  const isDeleteModalOpen = modalState.type === 'delete';

  return (
    <>
      <Toaster position="top-right" />
      <motion.div 
        className="max-w-7xl mx-auto my-8 p-4 sm:p-6 lg:p-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ShippingMethodHeader onAddClick={() => openModal('add')} loading={loading} />
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {renderContent()}
        </div>
      </motion.div>

      {/* --- MODALS --- */}
      <ShippingMethodFormModal
        isOpen={isFormModalOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        isEditing={modalState.type === 'edit'}
        initialData={modalState.data}
        isProcessing={loading}
      />
      
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        itemName={modalState.data?.name}
        itemType="shipping method"
        isProcessing={loading}
      />
    </>
  );
}