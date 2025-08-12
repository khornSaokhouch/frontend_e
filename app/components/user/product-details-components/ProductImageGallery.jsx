import Image from "next/image";

export default function ProductImageGallery({ product }) {
  if (!product) return null;

  return (
    // The main container for the image column
    <div className="lg:col-span-1">
      {/* Optional: "NEW" badge for visual flair */}
      <div className="absolute top-4 left-4 bg-black text-white text-xs font-bold py-1 px-2 rounded-md">
        NEW
      </div>

      {/* This is the container for the single, large product image */}
      <div className="relative h-[500px]">
        <Image
          src={product.product_image_url}
          alt={product.name}
          layout="fill"
          className="object-cover"
          priority
        />
      </div>

      {/* The thumbnail section has been removed */}
    </div>
  );
}