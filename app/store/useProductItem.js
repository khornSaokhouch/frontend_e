// // stores/useProductItem.js
// import { create } from "zustand";
// import { request } from "../util/request"; // Adjust the path to your request helper

// export const useProductItem = create((set, get) => ({
//   productItems: [],
//   selectedProductItem: null,
//   loading: false,
//   error: null,

//   // GET /product-items
//   fetchProductItems: async () => {
//     set({ loading: true, error: null });
//     try {
//       const res = await request("/product-items", "GET");
//       set({ productItems: res.data, loading: false });
//     } catch (err) {
//       set({
//         error: err.message || "Failed to fetch product items",
//         loading: false,
//       });
//     }
//   },

//   // GET /product-items/{id}
//   fetchProductItemById: async (id) => {
//     set({ loading: true, error: null });
//     try {
//       const res = await request(`/product-items/${id}`, "GET");
//       set({ selectedProductItem: res.data, loading: false });
//     } catch (err) {
//       set({
//         error: err.message || "Failed to fetch product item",
//         loading: false,
//       });
//     }
//   },

//   // POST /product-items
//   createProductItem: async (itemData) => {
//     console.log("Creating product item:", itemData);
  
//     set({ loading: true, error: null });
//     try {
//       const res = await request("/product-items", "POST", itemData); // make sure this sends JSON
//       await get().fetchProductItems(); // refresh the list after creation
//       set({ loading: false });
//       return res.data; // return created product item data
//     } catch (err) {
//       set({
//         error: err.message || "Failed to create product item",
//         loading: false,
//       });
//       throw err; // rethrow error so caller can catch if needed
//     }
//   },
  

//   // PUT /product-items/{id}
//   updateProductItem: async (id, data) => {
//     set({ loading: true, error: null });
//     try {
//       const res = await request(`/product-items/${id}`, "PUT", data);
//       // Optionally refresh list
//       await get().fetchProductItems();
//       set({ loading: false });
//       return res.data;
//     } catch (err) {
//       set({
//         error: err.message || "Failed to update product item",
//         loading: false,
//       });
//     }
//   },

//   // DELETE /product-items/{id}
//   deleteProductItem: async (id) => {
//     set({ loading: true, error: null });
//     try {
//       await request(`/product-items/${id}`, "DELETE");
//       // Refresh list
//       await get().fetchProductItems();
//       set({ loading: false });
//     } catch (err) {
//       set({
//         error: err.message || "Failed to delete product item",
//         loading: false,
//       });
//     }
//   },

//   // Utility
//   clearSelectedProductItem: () => set({ selectedProductItem: null }),
// }));
