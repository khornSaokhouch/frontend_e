// File: app/components/user/orders/OrderItemsList.js
"use client";

export default function OrderItemsList({ items }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-gray-500 py-4">No items found in this order.</p>;
  }

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-600 mb-2">Items Ordered</h4>
      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
        {items.map((line) => (
          <li key={line.id} className="flex items-center justify-between p-3">
            <div className="flex items-center gap-4">
              <img 
                src={line.product_item?.product?.product_image_url || '/placeholder.svg'} 
                alt={line.product_item?.product?.name || "Product"}
                className="w-12 h-12 object-cover rounded-md"
              />
              <div>
                <p className="font-medium text-gray-800">{line.product_item?.product?.name || "Unknown Product"}</p>
                <p className="text-xs text-gray-500">Qty: {line.quantity}</p>
              </div>
            </div>
            <p className="font-semibold text-gray-700">
              ${(line.price * line.quantity).toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}