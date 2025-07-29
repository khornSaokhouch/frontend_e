'use client';
import React, { useEffect, useState } from 'react';
import { useOrderLineStore } from '../../../store/useOrderLine';

export default function OrderLineManager() {
  const {
    orderLines = [],     // Ensure it's an array even if undefined
    fetchOrderLines,
    createOrderLine,
    updateOrderLine,
    deleteOrderLine,
    loading,
    error,
  } = useOrderLineStore();

  const [form, setForm] = useState({
    product_item_id: '',
    order_id: '',
    quantity: '',
    price: '',
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchOrderLines();
  }, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const isValid = form.product_item_id && form.order_id && form.quantity && form.price;
    if (!isValid) {
      alert("All fields are required.");
      return;
    }

    try {
      if (editId) {
        await updateOrderLine(editId, form);
        setEditId(null);
      } else {
        await createOrderLine(form);
      }
      setForm({ product_item_id: '', order_id: '', quantity: '', price: '' });
    } catch (err) {
      console.error("Failed to save order line:", err);
    }
  };

  const handleEdit = (line) => {
    setForm({
      product_item_id: line.product_item_id,
      order_id: line.order_id,
      quantity: line.quantity,
      price: line.price,
    });
    setEditId(line.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order line?")) {
      await deleteOrderLine(id);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>Order Lines</h2>

      {loading && <p>Loading...</p>}
{error && <p style={{ color: 'red' }}>{error}</p>}

{Array.isArray(orderLines) && orderLines.length > 0 ? (
  <ul>
    {orderLines.map(line => (
      <li key={line.id}>
        Order #{line.order_id} - Product #{line.product_item_id} - Qty: {line.quantity} - Price: {line.price}
        <button onClick={() => handleEdit(line)}>Edit</button>
        <button onClick={() => handleDelete(line.id)}>Delete</button>
      </li>
    ))}
  </ul>
) : (
  <p>No order lines found.</p>
)}



      <div style={{ marginTop: 20 }}>
        <h3>{editId ? 'Edit' : 'Create'} Order Line</h3>
        <input
          name="order_id"
          placeholder="Order ID"
          value={form.order_id}
          onChange={handleChange}
        />
        <input
          name="product_item_id"
          placeholder="Product Item ID"
          value={form.product_item_id}
          onChange={handleChange}
        />
        <input
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
        />
        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>{editId ? 'Update' : 'Create'}</button>
      </div>
    </div>
  );
}
