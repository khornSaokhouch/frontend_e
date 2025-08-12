"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "../../store/useProductStore";
import { useShoppingCartStore } from "../../store/useShoppingCart";
import { useUserStore } from "../../store/userStore";
import { useFavouritesStore } from "../../store/useFavouritesStore";
import { AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

// --- UI Components ---
import ProductImageGallery from "./product-details-components/ProductImageGallery";
import ProductInfo from "./product-details-components/ProductInfo";
import ProductActions from "./product-details-components/ProductActions";
import ProductMeta from "./product-details-components/ProductMeta";
import RightSidebar from "./product-details-components/RightSidebar";
import PaymentMethods from "./product-details-components/PaymentMethods";
import ProductDiscountSection from "./ProductDiscountSection";
import Products from "./Products";
import UserReviews from "./UserReviews"; // This is your ProductReviews component

export default function ProductDetails({ productId }) {
  // You correctly get the user ID here
  const userId = useUserStore((state) => state.user?.id);

  const { product, loading, error, fetchProduct } = useProductStore();
  const { carts, updateCart, fetchCartsByUserId } = useShoppingCartStore();
  const { addFavourite, favourites } = useFavouritesStore();

  const [quantity, setQuantity] = useState(1);
  const [isFavourited, setIsFavourited] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
    if (userId) {
      fetchCartsByUserId(userId);
    }
  }, [productId, userId, fetchProduct, fetchCartsByUserId]);

  useEffect(() => {
    if (product && Array.isArray(favourites)) {
      const cleanFavourites = favourites.filter((fav) => fav && fav.product_id);
      const isFav = cleanFavourites.some((fav) => fav.product_id === product.id);
      setIsFavourited(isFav);
    }
  }, [product, favourites]);

  const handleFavouriteClick = async () => {
    if (!userId) return toast.error("Please log in to add favourites.");
    if (!product?.id) return;
    const newFavouritedState = !isFavourited;
    setIsFavourited(newFavouritedState);
    try {
      await addFavourite({ user_id: userId, product_id: product.id });
      toast.success(
        newFavouritedState ? "Added to favourites!" : "Removed from favourites."
      );
    } catch (err) {
      setIsFavourited(!newFavouritedState);
      toast.error("Failed to update favourites.");
    }
  };

  const handleAddToCart = async () => {
    if (!userId) return toast.error("Please log in to add items to your cart.");
    if (!product?.id) return;

    const cart = carts[0];
    if (!cart) {
      toast.error("Could not find your cart. Please contact support.");
      return;
    }

    const currentItems = cart.items || [];
    const itemIndex = currentItems.findIndex(
      (item) => item.product_item_id === product.id
    );

    let updatedItems;
    if (itemIndex > -1) {
      updatedItems = currentItems.map((item, index) =>
        index === itemIndex ? { ...item, qty: item.qty + quantity } : item
      );
    } else {
      updatedItems = [
        ...currentItems,
        { product_item_id: product.id, qty: quantity },
      ];
    }

    await toast.promise(updateCart(cart.id, { items: updatedItems }), {
      loading: "Updating cart...",
      success: `${quantity} x ${product.name} added!`,
      error: (err) => err.message || "Failed to update cart.",
    });

    await fetchCartsByUserId(userId);
  };

  // ... your loading and error states ...

  return (
    <div className="bg-gray-50">
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="bg-white rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ... other columns ... */}
          <ProductImageGallery product={product} />

          <div className="lg:col-span-1 p-6 flex flex-col justify-between">
            <div>
              <ProductInfo product={product} />
              <ProductActions
                quantity={quantity}
                setQuantity={setQuantity}
                handleAddToCart={handleAddToCart}
                handleFavouriteClick={handleFavouriteClick}
                isFavourited={isFavourited}
              />
            </div>
            <ProductMeta />
          </div>

          <RightSidebar product={product} />
        </motion.div>

        <PaymentMethods />

        <section className="mt-12">
          <ProductDiscountSection />
        </section>

        <section className="mt-20">
          <div className="text-center">
            <Products />
          </div>
        </section>

        {/* User Reviews Section */}
        <section className="mt-20">
          <div className=" mx-auto">
            {/* 
              =======================================================
              THE FIX IS HERE: Pass the `userId` prop to UserReviews.
              =======================================================
            */}
            <UserReviews productId={productId} userId={userId} />
          </div>
        </section>
      </main>
    </div>
  );
}