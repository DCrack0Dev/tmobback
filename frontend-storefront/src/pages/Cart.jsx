import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import api from '../services/api';

const Cart = () => {
  const { t } = useTranslation();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { convertPrice, currency } = useCurrency();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCartItems = async () => {
      const items = [];
      for (const item of cart) {
        if (!item.name) {
          const response = await api.get(`/products/${item.product_id}`);
          items.push({ ...response.data, ...item, id: response.data.id });
        } else {
          items.push(item);
        }
      }
      setCartItems(items);
      setLoading(false);
    };
    loadCartItems();
  }, [cart]);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) {
    return <div className="text-center py-12">{t('common.loading')}</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <h2 className="text-2xl font-bold mb-4">{t('cart.empty')}</h2>
        <Link to="/products" className="text-blue-800 hover:underline">
          {t('cart.continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">{t('cart.title')}</h1>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {cartItems.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6 border-b">
            {/* Product Image */}
            <Link to={`/products/${item.id}`} className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
              {item.images?.[0] ? (
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-lg" />
              )}
            </Link>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <Link to={`/products/${item.id}`} className="font-semibold text-gray-900 hover:underline block truncate">
                {item.name}
              </Link>
              <div className="text-gray-500 text-sm">{item.brand}</div>
              <div className="text-blue-800 font-bold mt-1">
                {currency} {convertPrice(item.price)}
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.product_id || item.id, Math.max(1, item.quantity - 1))}
                className="w-8 h-8 rounded-lg border flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product_id || item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-lg border flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>

            {/* Price & Remove */}
            <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
              <div className="font-bold text-gray-900">
                {currency} {convertPrice(item.price * item.quantity)}
              </div>
              <button
                onClick={() => removeFromCart(item.product_id || item.id)}
                className="text-red-600 text-sm hover:underline"
              >
                {t('cart.remove')}
              </button>
            </div>
          </div>
        ))}

        <div className="p-4 sm:p-6 flex justify-between items-center">
          <div className="text-lg sm:text-xl font-semibold">{t('cart.subtotal')}:</div>
          <div className="text-xl sm:text-2xl font-bold text-blue-800">
            {currency} {convertPrice(total)}
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t">
          <Link
            to="/checkout"
            className="w-full bg-blue-800 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-center block"
          >
            {t('cart.checkout')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
