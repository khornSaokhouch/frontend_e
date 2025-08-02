"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "../../store/useProductStore";
import { useShoppingCartStore } from "../../store/useShoppingCart";
import { useUserStore } from "../../store/userStore";
import { useFavouritesStore } from "../../store/useFavouritesStore";
import Image from "next/image";
// import {
//   Heart,
//   ShoppingCart,
//   Minus,
//   Plus,
//   ShieldCheck,
//   AlertTriangle,
// } from "lucide-react";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Dribbble
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import Products from "./Products"; // This will render the grid of related products

export default function ProductDetails({ productId }) {
  // --- ALL OF YOUR EXISTING STATE AND LOGIC REMAINS UNCHANGED ---
  const userId = useUserStore((state) => state.user?.id);
  const { product, loading, error, fetchProduct } = useProductStore();
  const { createCart } = useShoppingCartStore();
  const { addFavourite, favourites } = useFavouritesStore();

  const [quantity, setQuantity] = useState(1);
  const [isFavourited, setIsFavourited] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  useEffect(() => {
    if (product && Array.isArray(favourites)) {
      const cleanFavourites = favourites.filter((fav) => fav && fav.product_id);
      const isFav = cleanFavourites.some(
        (fav) => fav.product_id === product.id
      );
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
    await toast.promise(
      createCart({
        user_id: userId,
        items: [{ product_item_id: product.id, qty: quantity }],
      }),
      {
        loading: "Adding to cart...",
        success: `${quantity} x ${product.name} added!`,
        error: (err) => err.message || "Failed to add to cart.",
      }
    );
  };
  // --- END OF LOGIC SECTION ---

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[80vh]">
  //       <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500"></div>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
        <h3 className="text-2xl font-bold text-red-800">An Error Occurred</h3>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20 text-lg">Product loading ......</div>;
  }

  // --- NEW, STRUCTURED DESIGN TO MATCH THE IMAGE ---
  return (
    <div className="bg-gray-50">
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <motion.div
          className="bg-white rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Image Section */}
          <div className="lg:col-span-1">
            {/* NEW Badge */}
            <div className="absolute top-4 left-4 bg-black text-white text-xs font-bold py-1 px-2 rounded-md">
              NEW
            </div>
            <div className="relative h-[500px]">
              <Image
                src={product.product_image_url}
                alt={product.name}
                layout="fill"
                className="object-cover"
                priority
              />
            </div>
            <div className="flex items-center justify-center gap-2 py-2 px-4">
              <Image
                src={product.product_image_url}
                alt={product.name}
                width={70}
                height={70}
                className="object-cover rounded-md"
              />
              <Image
                src={product.product_image_url}
                alt={product.name}
                width={70}
                height={70}
                className="object-cover rounded-md"
              />
              <Image
                src={product.product_image_url}
                alt={product.name}
                width={70}
                height={70}
                className="object-cover rounded-md"
              />
            </div>
          </div>

          {/* Details and Actions Section */}
          <div className="lg:col-span-1 p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {product.name}
              </h1>
              <h2 className="text-xl font-semibold text-gray-900">Dark Grey</h2>
              <p className="mt-2 text-3xl font-bold text-gray-800">
                ${product.price?.toFixed(2)}
              </p>
              <p className="mt-4 text-gray-600 text-sm">
                Intel LGA 1700 Socket: Supports 13th & 12th Gen Intel Core
                Processors. DDR5 Compatible: 4*SMD DIMMs with XMP 3.0 Memory
                Module Support Commanding Power Design: Twin 16+1+2 Phases
                Digital VRM
              </p>

              <button className="bg-green-100 text-green-400 py-1 px-4 rounded-md mt-4 text-sm">
                Free Shipping
              </button>

              <div className="mt-4 flex items-center">
                <ShieldCheck className="w-4 h-4 text-green-500 mr-1" />
                <p className="text-sm text-green-600 font-medium">In Stock</p>
              </div>

              {/* Quantity and Add to Cart Section */}
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                {/* Quantity Selector */}
                <div>
                  <p className="font-semibold text-gray-700 mb-2">Quantity</p>
                  <div className="flex items-center rounded-full border border-gray-300 w-fit overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-5 font-bold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 text-gray-600 hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart + Favourite */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="bg-green-500 text-white py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 hover:bg-green-600 transition shadow-lg shadow-green-500/30"
                  >
                    ADD TO CART
                  </button>
                  <button
                    onClick={handleFavouriteClick}
                    className="p-3 border border-gray-300 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-300 transition"
                    aria-label="Add to favourites"
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        isFavourited
                          ? "fill-red-500 stroke-red-500"
                          : "fill-transparent"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <p className="mt-6 text-sm text-gray-500">
                Guaranteed Safe Checkout
              </p>
              {/* Payment Icons */}
              <div className="flex items-center mt-2">
                <Image
                  src="/payment-icons.png"
                  alt="Payment Options"
                  width={250}
                  height={30}
                  className="object-contain"
                />
              </div>
              <p className="mt-6 text-sm text-gray-500">SKU: ABC025168</p>
              <p className="mt-6 text-sm text-gray-500">
                CATEGORY: Cell Phones & Tablets
              </p>
              <p className="mt-6 text-sm text-gray-500">
                TAGS: Laptop, Macbook, Computer, M1
              </p>


            </div>

          {/* Social Media Icons */}
<div className="flex items-center gap-3 mt-6">
  <a
    href="#"
    className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
  >
    <Twitter className="w-4 h-4" aria-label="Twitter" />
  </a>
  <a
    href="#"
    className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
  >
    <Facebook className="w-4 h-4" aria-label="Facebook" />
  </a>
  <a
    href="#"
    className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
  >
    <Instagram className="w-4 h-4" aria-label="Instagram" />
  </a>
  <a
    href="#"
    className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
  >
    <Youtube className="w-4 h-4" aria-label="YouTube" />
  </a>
  <a
    href="#"
    className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
  >
    <Dribbble className="w-4 h-4" aria-label="Dribbble" />
  </a>
</div>
          </div>

          {/* Right-Side Card: Brand and Your Cart */}
          <div className="lg:col-span-1 p-6 flex flex-col gap-6">
            {/* Brand Card */}
            <div className="bg-gray-50 rounded-3xl p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Brand: Sonex
              </h3>
              <Image
                src="/sonex-logo.png"
                alt="Sonex Logo"
                width={150}
                height={50}
                className="object-contain mx-auto"
              />
            </div>

            {/* Your Cart Card */}
            <div className="bg-white rounded-3xl p-4 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Your Cart
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={product.product_image_url}
                    alt={product.name}
                    width={70}
                    height={70}
                    className="object-cover rounded-md"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      3 x ${product.price?.toFixed(2)}
                    </p>
                  </div>
                </div>
                <hr className="border-gray-200 mb-4" />
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-gray-700">
                    Sub Total:
                  </p>
                  <p className="text-sm font-bold text-gray-800">$1,737.00</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button className="bg-gray-800 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-900 transition-colors">
                  View Cart
                </button>
                <button className="bg-green-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-600 transition-colors">
                  Checkout
                </button>
                <p className="mt-4 text-green-500 flex items-center justify-center text-xs">
                  <ShoppingCart className="w-5 h-5 text-black mr-1" />
                  Ships From{" "}
                  <span className="font-semibold text-black ml-1">
                    United States
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>


{/* Section 1: Payment Methods */}
<section className="mt-2">
  <div className="flex items-center justify-center lg:justify-start gap-6 w-full">
    {/* Payment Icon 1 */}
    <div className="relative h-60 flex-1">
      <Image
        src="/visa.png" // Ensure the file exists in /public
        alt="Visa"
        fill
        className="object-contain"
      />
    </div>

    {/* Payment Icon 2 */}
    <div className="relative h-60 flex-1">
      <Image
        src="/acleda.png" // Update the image name if needed
        alt="ACLEDA"
        fill
        className="object-contain"
      />
    </div>
  </div>
</section>




        {/* Section 2: Related Products */}
        <section className="mt-20">
          <div className="text-center">
            <Products />
          </div>
        </section>
      </main>
    </div>
  );
}
