'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Product } from '../components/home/ProductCard';

export interface CartItem {
  product: Product;
  pkgIdx: number;
  pkgLabel: string;
  priceValue: number;
  originalValue: number;
  formattedPrice: string;
  qty: number;
  sku: string;
}

export interface CheckoutPayload {
  product: Product;
  pkgIdx: number;
  pkgLabel: string;
  priceValue: number;
  originalValue: number;
  formattedPrice: string;
  qty: number;
  sku: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number, pkgIdx: number) => void;
  updateQty: (productId: number, pkgIdx: number, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalValue: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const addItem = useCallback((newItem: CartItem) => {
    setItems(prev => {
      const idx = prev.findIndex(
        i => i.product.id === newItem.product.id && i.pkgIdx === newItem.pkgIdx,
      );
      if (idx >= 0) {
        return prev.map((i, j) => (j === idx ? { ...i, qty: i.qty + newItem.qty } : i));
      }
      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((productId: number, pkgIdx: number) => {
    setItems(prev =>
      prev.filter(i => !(i.product.id === productId && i.pkgIdx === pkgIdx)),
    );
  }, []);

  const updateQty = useCallback((productId: number, pkgIdx: number, qty: number) => {
    setItems(prev =>
      prev.map(i =>
        i.product.id === productId && i.pkgIdx === pkgIdx ? { ...i, qty } : i,
      ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const openDrawer  = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalValue = items.reduce((s, i) => s + i.priceValue * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items, addItem, removeItem, updateQty, clearCart,
        totalItems, totalValue,
        drawerOpen, openDrawer, closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
