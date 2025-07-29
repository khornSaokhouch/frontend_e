"use client";
import { useParams } from 'next/navigation';
import ProductsByCategoryPage from '../../../components/user/ProductsByCategoryPage';

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.categoryId;

  return <ProductsByCategoryPage categoryId={categoryId} />;
}
