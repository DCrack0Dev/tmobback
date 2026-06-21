import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import api from '../services/api';

const Checkout = () => {
  const { t } = useTranslation();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { convertPrice, currency } = useCurrency();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    shipping_address: {
      address: '',
      city: '',
      state: '',
      postal_code: '',
      country: ''
    },
    create_account: false,
    password: ''
  });

  useEffect(() => {
    const loadCartItems = async () => {
      try {
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

        if (user) {
          setFormData(prev => ({
            ...prev,
            guest_name: user.name,
            guest_email: user.email,
            guest_phone: user.phone || ''
          }));
        }
      } catch (err) {
        console.error('Failed to load cart items:', err);
        setError('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };
    loadCartItems();
  }, [cart, user]);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const response = await api.post('/orders', {
        ...formData,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      });
      clearCart();
      navigate(`/orders/${response.data.id}`);
    } catch (err) {
      console.error('Failed to place order:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">{t('common.loading')}</div>;
  }

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">{t('checkout.title')}</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Shipping Info */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">{t('checkout.shippingInfo')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">{t('checkout.fullName')}</label>
              <input
                type="text"
                required
                value={formData.guest_name}
                onChange={(e) => setFormData(prev => ({ ...prev, guest_name: e.target.value }))}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">{t('checkout.email')}</label>
              <input
                type="email"
                required
                value={formData.guest_email}
                onChange={(e) => setFormData(prev => ({ ...prev, guest_email: e.target.value }))}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">{t('checkout.phone')}</label>
              <input
                type="tel"
                required
                value={formData.guest_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, guest_phone: e.target.value }))}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">{t('checkout.address')}</label>
              <input
                type="text"
                required
                value={formData.shipping_address.address}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  shipping_address: { ...prev.shipping_address, address: e.target.value }
                }))}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">{t('checkout.city')}</label>
                <input
                  type="text"
                  required
                  value={formData.shipping_address.city}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    shipping_address: { ...prev.shipping_address, city: e.target.value }
                  }))}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t('checkout.state')}</label>
                <input
                  type="text"
                  required
                  value={formData.shipping_address.state}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    shipping_address: { ...prev.shipping_address, state: e.target.value }
                  }))}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">{t('checkout.postalCode')}</label>
                <input
                  type="text"
                  required
                  value={formData.shipping_address.postal_code}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    shipping_address: { ...prev.shipping_address, postal_code: e.target.value }
                  }))}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t('checkout.country')}</label>
                <input
                  type="text"
                  required
                  value={formData.shipping_address.country}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    shipping_address: { ...prev.shipping_address, country: e.target.value }
                  }))}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {!user && (
              <div className="flex items-start gap-2 pt-4">
                <input
                  type="checkbox"
                  id="createAccount"
                  checked={formData.create_account}
                  onChange={(e) => setFormData(prev => ({ ...prev, create_account: e.target.checked }))}
                  className="mt-1 w-5 h-5"
                />
                <div className="flex-1">
                  <label htmlFor="createAccount" className="font-medium cursor-pointer">
                    {t('checkout.createAccount')}
                  </label>
                  {formData.create_account && (
                    <input
                      type="password"
                      required
                      placeholder={t('checkout.password')}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full border rounded-lg px-4 py-2 mt-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-800 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold mt-6"
            >
              {submitting ? 'Placing Order...' : t('checkout.placeOrder')}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">{t('checkout.orderSummary')}</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-gray-500 text-sm">Qty: {item.quantity}</div>
                </div>
                <div className="font-semibold text-right ml-2">{currency} {convertPrice(item.price * item.quantity)}</div>
              </div>
            ))}
            <div className="border-t pt-4 flex justify-between text-xl font-bold">
              <div>{t('checkout.total') || 'Total'}</div>
              <div>{currency} {convertPrice(total)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
