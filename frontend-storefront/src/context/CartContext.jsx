import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  const loadCart = async () => {
    if (user) {
      try {
        const response = await api.get('/cart');
        setCart(response.data);
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    } else {
      const saved = localStorage.getItem('guestCart');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  const saveGuestCart = (newCart) => {
    localStorage.setItem('guestCart', JSON.stringify(newCart));
  };

  const addToCart = async (productId, quantity = 1) => {
    if (user) {
      await api.post('/cart', { product_id: productId, quantity });
      await loadCart();
    } else {
      const existing = cart.find(item => item.product_id === productId);
      let newCart;
      if (existing) {
        newCart = cart.map(item =>
          item.product_id === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        newCart = [...cart, { product_id: productId, quantity, id: Date.now() }];
      }
      setCart(newCart);
      saveGuestCart(newCart);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (user) {
      await api.put(`/cart/${productId}`, { quantity });
      await loadCart();
    } else {
      const newCart = cart.map(item =>
        item.product_id === productId ? { ...item, quantity } : item
      );
      setCart(newCart);
      saveGuestCart(newCart);
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      await api.delete(`/cart/${productId}`);
      await loadCart();
    } else {
      const newCart = cart.filter(item => item.product_id !== productId);
      setCart(newCart);
      saveGuestCart(newCart);
    }
  };

  const clearCart = () => {
    setCart([]);
    if (!user) {
      localStorage.removeItem('guestCart');
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, loadCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
