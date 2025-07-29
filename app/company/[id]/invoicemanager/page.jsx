"use client";
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useInvoiceStore } from '../../../store/useInvoice'; // Make sure this store exists

// A reusable Modal component styled with Tailwind CSS
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 transition-opacity"
      onClick={onClose} // Close modal on overlay click
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all"
        onClick={e => e.stopPropagation()} // Prevent modal close on content click
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        {/* Modal Body */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default function InvoiceManager() {
  const {
    invoices,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    loading,
    error,
  } = useInvoiceStore();

  // State for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // State for new invoice form
  const [newInvoice, setNewInvoice] = useState({
    order_id: '',
    invoice_number: '',
    generated_at: '',
    total_amount: '',
  });

  // State for editing invoice
  const [editingInvoice, setEditingInvoice] = useState(null);
  
  // State for invoice to be deleted
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);
  
  useEffect(() => {
    if (error) {
      toast.error(`An error occurred: ${error}`);
    }
  }, [error]);

  const handleChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'new') {
      setNewInvoice((prev) => ({ ...prev, [name]: value }));
    } else if (formType === 'edit') {
      setEditingInvoice((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newInvoice.order_id || !newInvoice.invoice_number || !newInvoice.total_amount) {
      toast.error('Order ID, Invoice Number, and Total Amount are required');
      return;
    }
    const result = await createInvoice(newInvoice);
    if(result) {
      toast.success('Invoice created successfully!');
      setNewInvoice({ order_id: '', invoice_number: '', generated_at: '', total_amount: '' });
      setIsAddModalOpen(false);
    }
  };

  const handleEditClick = (invoice) => {
    setEditingInvoice({
      ...invoice,
      generated_at: invoice.generated_at ? invoice.generated_at.slice(0, 10) : '',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingInvoice.order_id || !editingInvoice.invoice_number || !editingInvoice.total_amount) {
      toast.error('Order ID, Invoice Number, and Total Amount are required');
      return;
    }
    const result = await updateInvoice(editingInvoice.id, editingInvoice);
    if(result) {
      toast.success('Invoice updated successfully!');
      setEditingInvoice(null);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteClick = (invoice) => {
    setInvoiceToDelete(invoice);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!invoiceToDelete) return;
    await deleteInvoice(invoiceToDelete.id);
    toast.success(`Invoice #${invoiceToDelete.invoice_number} deleted successfully!`);
    setInvoiceToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // Common Tailwind classes for buttons and inputs
  const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
  const primaryButtonClasses = "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200";
  const secondaryButtonClasses = "bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200";
  const deleteButtonClasses = "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200";
  
  return (
    <div className="max-w-6xl mx-auto my-8 p-4 font-sans">
      {/* <Toaster position="top-center" reverseOrder={false} /> */}

      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Invoice Manager</h1>
        <button className={primaryButtonClasses} onClick={() => setIsAddModalOpen(true)}>
          + Add New Invoice
        </button>
      </div>

      {/* Loading State */}
      {loading && <p className="text-center text-gray-500">Loading invoices...</p>}

      {/* Main Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inv.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{inv.order_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{inv.invoice_number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{inv.generated_at ? new Date(inv.generated_at).toLocaleDateString() : 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${parseFloat(inv.total_amount).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-1 px-3 rounded text-xs" onClick={() => handleEditClick(inv)}>Edit</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-xs" onClick={() => handleDeleteClick(inv)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ====== MODALS ====== */}

      {/* Add Invoice Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Invoice">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Order ID</label>
            <input type="text" name="order_id" placeholder="e.g., 1001" value={newInvoice.order_id} onChange={(e) => handleChange(e, 'new')} className={inputClasses} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
            <input type="text" name="invoice_number" placeholder="e.g., INV-2024-001" value={newInvoice.invoice_number} onChange={(e) => handleChange(e, 'new')} className={inputClasses} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Generated At</label>
            <input type="date" name="generated_at" value={newInvoice.generated_at} onChange={(e) => handleChange(e, 'new')} className={inputClasses} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Amount</label>
            <input type="number" step="0.01" name="total_amount" placeholder="e.g., 199.99" value={newInvoice.total_amount} onChange={(e) => handleChange(e, 'new')} className={inputClasses} required />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" className={secondaryButtonClasses} onClick={() => setIsAddModalOpen(false)}>Cancel</button>
            <button type="submit" className={primaryButtonClasses}>Add Invoice</button>
          </div>
        </form>
      </Modal>

      {/* Edit Invoice Modal */}
      {editingInvoice && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit Invoice #${editingInvoice.invoice_number}`}>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Order ID</label>
              <input type="text" name="order_id" value={editingInvoice.order_id} onChange={(e) => handleChange(e, 'edit')} className={inputClasses} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
              <input type="text" name="invoice_number" value={editingInvoice.invoice_number} onChange={(e) => handleChange(e, 'edit')} className={inputClasses} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Generated At</label>
              <input type="date" name="generated_at" value={editingInvoice.generated_at} onChange={(e) => handleChange(e, 'edit')} className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Amount</label>
              <input type="number" step="0.01" name="total_amount" value={editingInvoice.total_amount} onChange={(e) => handleChange(e, 'edit')} className={inputClasses} required />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" className={secondaryButtonClasses} onClick={() => setIsEditModalOpen(false)}>Cancel</button>
              <button type="submit" className={primaryButtonClasses}>Save Changes</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {invoiceToDelete && (
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
          <p className="text-gray-700">Are you sure you want to delete Invoice <strong className="font-semibold">#{invoiceToDelete.invoice_number}</strong>?</p>
          <p className="text-sm text-red-600 mt-2">This action cannot be undone.</p>
          <div className="flex justify-end space-x-3 pt-4 mt-4">
            <button className={secondaryButtonClasses} onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
            <button className={deleteButtonClasses} onClick={handleDeleteConfirm}>Confirm Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}