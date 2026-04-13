import { GetLoggedUserWishlist } from "@/actions/wishlist.actions";
import WishlistDisplay from "../_componant/WishlistDisplay/WishlistDisplay";

export default async function wishlist() {
  // الطلب بيتم من السيرفر مباشرة
  const data = await GetLoggedUserWishlist();

  return (
    <main className="bg-[#fcfcfc] min-h-screen">
      <WishlistDisplay initialData={data} />
    </main>
  );
}