"use client";

import { useParams } from 'next/navigation';
import StoreManager from '../../../components/company/store/StoreManager';

export default function StorePage() {
  const params = useParams();
  const userId = params?.id;

  if (!userId) return <p>Loading...</p>;

  return (
    <div>
      <StoreManager userId={userId} />
    </div>
  );
}
