import { Minus, Plus, Heart } from "lucide-react";

export default function ProductActions({
  quantity,
  setQuantity,
  handleAddToCart,
  handleFavouriteClick,
  isFavourited,
}) {
  return (
    <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
      <div>
        <p className="font-semibold text-gray-700 mb-2">Quantity</p>
        <div className="flex items-center rounded-full border border-gray-300 w-fit overflow-hidden">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-gray-600 hover:bg-gray-100 disabled:opacity-50" disabled={quantity <= 1}>
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-5 font-bold text-lg">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-gray-600 hover:bg-gray-100">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={handleAddToCart} className="bg-green-500 text-white py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 hover:bg-green-600 transition shadow-lg shadow-green-500/30">
          ADD TO CART
        </button>
        <button onClick={handleFavouriteClick} className="p-3 border border-gray-300 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-300 transition" aria-label="Add to favourites">
          <Heart className={`w-6 h-6 ${isFavourited ? "fill-red-500 stroke-red-500" : "fill-transparent"}`} />
        </button>
      </div>
    </div>
  );
}