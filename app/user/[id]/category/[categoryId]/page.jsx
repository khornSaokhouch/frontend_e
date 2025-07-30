'use client';
import { useParams } from 'next/navigation';
import ProductsByCategoryPage from '../../../../components/user/ProductsByCategoryPage';

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params?.categoryId;

  if (!categoryId) {
    return <div className="text-center py-10 text-red-600">Invalid category ID</div>;
  }

  return <ProductsByCategoryPage categoryId={categoryId} />;
}
