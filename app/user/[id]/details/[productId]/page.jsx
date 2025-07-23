// app/user/[id]/details/[productId]/page.jsx
"use client";

import React from "react";
import ProductDetails from "../../../../components/user/ProductDetails"; // Adjust path
import { useParams } from "next/navigation";

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.productId; // get the actual productId string

  return <ProductDetails productId={productId} />;
}
