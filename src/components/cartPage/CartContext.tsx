"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: number;
  title: string;
  image: string;
  year: number;
  ram: string;
  warranty: string;
  price: number;
  quantity: number;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  calculateTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCartData = () => {
      try {
        const data = localStorage.getItem("cart");
        if (data) {
          const parsedData = JSON.parse(data).map((item: CartItem) => ({
            ...item,
            image: item.image?.startsWith("/")
              ? item.image
              : `/product_images/${item.image || "default.png"}`,
          }));
          setCart(parsedData);
        }
      } catch (error) {
        console.error("Failed to load cart data:", error);
      }
    };

    loadCartData();
  }, []);

  const saveCartToLocalStorage = (updatedCart: CartItem[]) => {
    try {
      const cartWithDefaults = updatedCart.map((item) => ({
        ...item,
        image: item.image?.startsWith("/")
          ? item.image
          : `/product_images/${item.image || "default.png"}`,
      }));
      localStorage.setItem("cart", JSON.stringify(cartWithDefaults));
    } catch (error) {
      console.error("Failed to save cart data:", error);
    }
  };

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        updatedCart = [...prevCart, item];
      }
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== id);
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      );
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        calculateTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
