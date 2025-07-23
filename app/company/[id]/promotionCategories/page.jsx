"use client";

import { useParams } from "next/navigation";
import PromotionCategories from "../../../components/company/PromotionCategories";

export default function PromotionPage() {
  const params = useParams();
  const promotionId = params.id;

  return (
    <div>
      <PromotionCategories promotionId={promotionId} />
    </div>
  );
}
