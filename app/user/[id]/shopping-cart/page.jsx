// "use client";

// import { useEffect } from "react";
// import { useShoppingCartItem } from "../../../store/useShoppingCart";


// export default function ShoppingCart({ title = "Your Shopping Cart" }) {
//   const {
//     items,
//     loading,
//     error,
//     fetchShoppingCartItems,
//     deleteShoppingCartItem,
//   } = useShoppingCartItem();

//   useEffect(() => {
//     fetchShoppingCartItems();
//   }, []);

//   if (loading) return <p className="text-center text-gray-500">Loading cart...</p>;
//   if (error) return <p className="text-center text-red-500">{error}</p>;

//   return (
//     <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
//       <h2 className="text-2xl font-semibold text-center mb-4">{title}</h2>

//       {items.length === 0 ? (
//         <p className="text-center text-gray-500">Your cart is empty.</p>
//       ) : (
//         <ul className="divide-y divide-gray-200">
//           {items.map((item) => (
//             <li key={item.id} className="flex items-center justify-between py-3">
//               <div>
//                 <p className="font-medium text-gray-800">Item #{item.product_item_id}</p>
//                 <p className="text-sm text-gray-500">Qty: {item.qty}</p>
//               </div>
//               <button
//                 className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
//                 onClick={() => deleteShoppingCartItem(item.id)}
//               >
//                 Remove
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
