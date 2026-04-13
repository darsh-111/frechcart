import { GetLoggedUserCart } from "@/actions/card.actions";
import CartDisplay from "../_componant/CartDisplay/CartDisplay"; // هنكريت الـ component ده

export default async function CartPage() {
  // 1. هات الداتا في السيرفر
  const cartData = await GetLoggedUserCart();

  // 2. لو مفيش داتا أو التوكن ضارب
  if (!cartData || cartData.status === "error") {
    return <div className="p-20 text-center">برجاء تسجيل الدخول أولاً</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* 3. ابعت الداتا للـ Client Component اللي فيه الديزاين */}
      <CartDisplay initialData={cartData} />
    </div>
  );
}