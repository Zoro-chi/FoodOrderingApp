import { createContext, PropsWithChildren, useContext, useState } from "react";
import { randomUUID } from "expo-crypto";

import { CartItem, Product } from "@/types";

type CartType = {
  items: CartItem[];
  onAddItem: (product: Product, size: CartItem["size"]) => void;
  onRemoveItem: (product: Product, size: CartItem["size"]) => void;
  updateQuantity: (id: string, quantity: -1 | 1) => void;
  totalPrice?: number;
  totalItems?: number;
};

export const CartContext = createContext<CartType>({
  items: [],
  onAddItem: () => {},
  onRemoveItem: () => {},
  updateQuantity: () => {},
  totalPrice: 0,
  totalItems: 0,
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const onAddItem = (product: Product, size: CartItem["size"]) => {
    const existingItem = items.find(
      (item) => item.product.id === product.id && item.size === size
    );
    if (existingItem) {
      updateQuantity(existingItem.id, 1);
      return;
    }

    const newCartItem: CartItem = {
      id: randomUUID(),
      product,
      product_id: product.id,
      size,
      quantity: 1,
    };

    setItems([newCartItem, ...items]);
    console.log("Items in cart", items);
  };

  const onRemoveItem = (product: Product, size: CartItem["size"]) => {
    setItems((prev) =>
      prev.filter(
        (item) => item.product.id !== product.id || item.size !== size
      )
    );
  };

  const updateQuantity = (id: string, quantity: -1 | 1) => {
    console.log("Updating quantity", id, quantity);

    setItems(
      items
        .map((item) =>
          item.id !== id
            ? item
            : { ...item, quantity: item.quantity + quantity }
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        onAddItem,
        onRemoveItem,
        updateQuantity,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);
