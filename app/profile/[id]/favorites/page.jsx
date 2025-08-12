"use client";
import { useParams } from "next/navigation";
import Favourites from "../../../components/user/Favortes";

export default function UserFavouritesPage() {
  const params = useParams();
  const userId = params?.id;

  if (!userId) {
    return <p>User ID not found</p>;
  }

  return (
    <div>
      <Favourites userId={userId} />
    </div>
  );
}
