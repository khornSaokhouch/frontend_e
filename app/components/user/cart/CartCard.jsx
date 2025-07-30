// File: components/user/cart/CartCard.js
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

export default function CartCard({ cart, userId, onQuantityChange, onDeleteItem }) {
  const cartTotal = cart.items.reduce((total, item) => {
    const price = item.product_item?.product?.price || 0;
    return total + price * item.qty;
  }, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 sm:p-8">
      <div className="divide-y divide-gray-100">
        {cart.items.map((item) => (
          <div key={item.product_item_id} className="py-4 first:pt-0 last:pb-0">
            <CartItem
              item={item}
              cartId={cart.id} // ✅ Pass the cart.id down
              onQuantityChange={onQuantityChange}
              onDeleteItem={onDeleteItem}
            />
          </div>
        ))}
      </div>
      <CartSummary total={cartTotal} userId={userId} />
    </div>
  );
}