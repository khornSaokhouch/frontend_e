"use client"

import { useEffect, useState, useRef } from "react"
import { usePaymentTypeStore } from "../../../store/usePaymentType"
import { motion, AnimatePresence } from "framer-motion"
import { useToast, ToastContainer } from "../../../components/ui/Toast"

// Import the new components
import PaymentTypeHeader from "../../../components/admin/paymentType/PaymentTypeHeader"
import PaymentTypeStats from "../../../components/admin/paymentType/PaymentTypeStats"
import PaymentTypeToolbar from "../../../components/admin/paymentType/PaymentTypeToolbar"
import PaymentTypeTable from "../../../components/admin/paymentType/PaymentTypeTable"
import LoadingState from "../../../components/admin/paymentType/LoadingState"
import ErrorState from "../../../components/admin/paymentType/ErrorState"
import EmptyState from "../../../components/admin/paymentType/EmptyState"

// Keep existing components that were already well-structured
import PaymentTypeModal from "../../../components/admin/paymentType/PaymentTypeModal"
import DeletePaymentTypeModal from "../../../components/admin/paymentType/DeletePaymentTypeModal"
import PaymentTypeCard from "../../../components/admin/paymentType/PaymentTypeCard"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function PaymentTypeManager() {
  const { paymentTypes, fetchPaymentTypes, createPaymentType, updatePaymentType, deletePaymentType, loading, error } =
    usePaymentTypeStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [modalState, setModalState] = useState({ type: null, data: null })
  const [inputValue, setInputValue] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [viewMode, setViewMode] = useState("grid")
  const { toasts, success, error: showError, warning, info, removeToast } = useToast()
  
  const initialFetchDone = useRef(false)

  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchPaymentTypes()
      success("Payment types loaded successfully!", { title: "Welcome", duration: 3000 })
      initialFetchDone.current = true
    }
  }, [fetchPaymentTypes, success])

  // --- Handlers remain in the parent component to manage state ---

  const openModal = (type, data = null) => {
    setModalState({ type, data })
    if (type === "edit" && data) {
      setInputValue(data.type)
    } else {
      setInputValue("")
    }
    info(type === "add" ? "Creating new payment type" : `Editing ${data?.type}`, {
      title: type === "add" ? "Create Mode" : "Edit Mode",
      duration: 3000,
    })
  }

  const closeModal = () => {
    setModalState({ type: null, data: null })
    setInputValue("")
  }

  const handleRefresh = () => {
    fetchPaymentTypes()
    info("Data refreshed", { duration: 2000 })
  }
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      showError("Payment type name is required", { title: "Validation Error" });
      return;
    }
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const action = modalState.type === 'add'
        ? createPaymentType({ type: inputValue.trim() })
        : updatePaymentType(modalState.data.id, { type: inputValue.trim() });
      
      const result = await action;

      if (result) {
        success(`${inputValue.trim()} ${modalState.type === 'add' ? 'created' : 'updated'} successfully!`);
        closeModal();
      } else {
        showError(`Failed to ${modalState.type === 'add' ? 'create' : 'update'} payment type.`);
      }
    } catch (err) {
      showError("An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (modalState.type !== "delete" || !modalState.data) return;
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = await deletePaymentType(modalState.data.id);
      if (result) {
        success(`${modalState.data.type} deleted successfully!`);
        closeModal();
      } else {
        showError("Failed to delete payment type.");
      }
    } catch (err) {
      showError("An unexpected error occurred during deletion.");
    } finally {
      setIsProcessing(false);
    }
  };


  const filteredPaymentTypes = paymentTypes.filter((pt) => pt.type?.toLowerCase().includes(searchTerm.toLowerCase()))

  const renderContent = () => {
    if (loading && paymentTypes.length === 0) {
      return <LoadingState message="Loading payment types..." />;
    }
    if (error) {
      return <ErrorState message={error} onRetry={fetchPaymentTypes} />;
    }
    if (filteredPaymentTypes.length === 0) {
      return <EmptyState onAddClick={() => openModal("add")} hasSearchTerm={!!searchTerm} />;
    }
    return (
      <div className="p-6">
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredPaymentTypes.map((pt, index) => (
                <PaymentTypeCard
                  key={pt.id}
                  paymentType={pt}
                  openEditModal={() => openModal("edit", pt)}
                  openDeleteModal={() => openModal("delete", pt)}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <PaymentTypeTable
              paymentTypes={filteredPaymentTypes}
              onEdit={(pt) => openModal("edit", pt)}
              onDelete={(pt) => openModal("delete", pt)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  };


  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
        
        <motion.div variants={itemVariants}>
          <PaymentTypeHeader onAddClick={() => openModal("add")} loading={loading} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <PaymentTypeStats paymentTypes={paymentTypes} />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <PaymentTypeToolbar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onRefresh={handleRefresh}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200/50 shadow-sm min-h-[300px]">
          {renderContent()}
        </motion.div>

      </motion.div>

      {/* Modals remain controlled by the main component's state */}
      <PaymentTypeModal
        isOpen={modalState.type === "add" || modalState.type === "edit"}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        inputValue={inputValue}
        setInputValue={setInputValue}
        isProcessing={isProcessing}
        isEditing={modalState.type === "edit"}
        paymentType={modalState.data}
      />
      <DeletePaymentTypeModal
        isOpen={modalState.type === "delete"}
        onClose={closeModal}
        paymentType={modalState.data}
        onConfirm={handleDeleteConfirm}
        isProcessing={isProcessing}
      />
    </>
  )
}