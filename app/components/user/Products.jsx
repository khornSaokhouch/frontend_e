"use client"
import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useProductStore } from "../../store/useProductStore"
import { useFavouritesStore } from "../../store/useFavouritesStore"
import ProductCard from "./ProductCard"
import { Loader2, Package } from "lucide-react"

export default function Products() {
  const { id } = useParams()
  const { products, loading, error, fetchAllProducts } = useProductStore()
  const { favourites, addFavourite, fetchFavourites } = useFavouritesStore()

  useEffect(() => {
    fetchAllProducts()
    fetchFavourites(id)
  }, [fetchAllProducts, fetchFavourites, id])

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-600 font-medium">Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Products</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No Products Found</h3>
          <p className="text-slate-600">Check back later for new products.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">All Products</h1>
          <p className="text-slate-600">Discover our latest collection</p>
        </div>
        <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {products.length} {products.length === 1 ? "product" : "products"}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const isFavourite = favourites?.some((fav) => fav?.product_id === product.id)
          return (
            <ProductCard
              key={product.id}
              product={product}
              userId={id}
              isFavourite={isFavourite}
              onAddFavourite={(productId) => addFavourite({ user_id: id, product_id: productId })}
            />
          )
        })}
      </div>
    </div>
  )
}
