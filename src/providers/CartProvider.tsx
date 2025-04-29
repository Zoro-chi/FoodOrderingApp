import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { randomUUID } from "expo-crypto";

import { CartItem, Tables } from "../types";
import { useInsertOrder } from "../api/orders/index";
import { useRouter } from "expo-router";
import { useInsertOrderItems } from "../api/order-items/index";
import { initializePaymentSheet, openPaymentSheet } from "@/lib/stripe";

type CartType = {
  items: CartItem[];
  onAddItem: (product: Tables<"products">, size: CartItem["size"]) => void;
  onRemoveItem: (product: Tables<"products">, size: CartItem["size"]) => void;
  updateQuantity: (id: string, quantity: -1 | 1) => void;
  totalPrice?: number;
  totalItems?: number;
  checkout?: () => void;
};

export const CartContext = createContext<CartType>({
  items: [],
  onAddItem: () => {},
  onRemoveItem: () => {},
  updateQuantity: () => {},
  totalPrice: 0,
  totalItems: 0,
  checkout: () => {},
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const router = useRouter();

  const { insertOrder } = useInsertOrder();
  const { insertOrderItems } = useInsertOrderItems();

  const onAddItem = (product: Tables<"products">, size: CartItem["size"]) => {
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

  const onRemoveItem = (
    product: Tables<"products">,
    size: CartItem["size"]
  ) => {
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

  const checkout = async () => {
    console.log("Checkout");

    await initializePaymentSheet(Math.floor(totalPrice * 100));
    const payed = await openPaymentSheet();

    if (!payed) {
      return;
    }

    insertOrder(
      {
        total: totalPrice,
      },
      {
        onSuccess: saveorderItems,
      }
    );
  };

  const saveorderItems = (order: Tables<"orders">) => {
    const orderItems = items.map((cartItem) => ({
      order_id: order.id,
      product_id: cartItem.product.id,
      quantity: cartItem.quantity,
      size: cartItem.size,
    }));
    console.log("Order items", orderItems);

    insertOrderItems(orderItems, {
      onSuccess: () => {
        console.log("Order created", order);
        setItems([]);
        router.push(`/(user)/orders/${order.id}`);
      },
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        onAddItem,
        onRemoveItem,
        updateQuantity,
        totalPrice,
        totalItems,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);
