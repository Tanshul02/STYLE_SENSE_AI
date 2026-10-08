import React from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CartProvider, useCart } from '../context/CartContext';
import { WishlistProvider, useWishlist } from '../context/WishlistContext';
import { UIProvider, useUI } from '../context/UIContext';

export { useAuth, useCart, useWishlist, useUI };

interface StoreProviderProps {
  children: React.ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <UIProvider>
            {children}
          </UIProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};
