import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartSummary } from '../types';
import { api } from '../services/api';

interface CartContextType {
  cart: CartSummary | null;
  isLoading: boolean;
  itemCount: number;
  addToCart: (productOrId: string | { id: string }, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  checkout: () => Promise<any>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = async () => {
    try {
      setIsLoading(true);
      const data = await api.getCart();
      setCart(data);
    } catch (err) {
      console.warn('Error fetching cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (productOrId: string | { id: string }, quantity = 1) => {
    setIsLoading(true);
    try {
      const pid = typeof productOrId === 'string' ? productOrId : productOrId.id;
      const updated = await api.addToCart(pid, quantity);
      setCart(updated);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    const updated = await api.updateCartQuantity(cartItemId, quantity);
    setCart(updated);
  };

  const removeFromCart = async (cartItemId: string) => {
    const updated = await api.removeFromCart(cartItemId);
    setCart(updated);
  };

  const checkout = async () => {
    const res = await api.checkout();
    await refreshCart();
    return res;
  };

  const clearCart = () => {
    setCart(null);
  };

  return (
    <CartContext.Provider value={{
      cart,
      isLoading,
      itemCount: cart?.item_count || 0,
      addToCart,
      updateQuantity,
      removeFromCart,
      checkout,
      clearCart,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
