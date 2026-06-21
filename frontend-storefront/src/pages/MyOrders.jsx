import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const MyOrders = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const response = await api.get('/orders');
      setOrders(response.data);
      setLoading(false);
    };
    loadOrders();
  }, []);

  const statusColors = {
    pending_payment: 'text-yellow-600 bg-yellow-50',
    payment_submitted: 'text-blue-600 bg-blue-50',
    paid: 'text-indigo-600 bg-indigo-50',
    shipped: 'text-purple-600 bg-purple-50',
    delivered: 'text-green-600 bg-green-50',
    cancelled: 'text-red-600 bg-red-50'
  };

  if (loading) {
    return <div className="text-center py-12">{t('common.loading')}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t('nav.myOrders')}</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-gray-600">No orders yet</p>
          <Link to="/products" className="text-blue-800 hover:underline mt-4 inline-block">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="bg-white rounded-xl shadow-md p-6 block hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-bold text-lg">Order #{order.id}</div>
                  <div className="text-gray-500 text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status]}`}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-600">Total</div>
                <div className="text-xl font-bold text-gray-900">${order.total_amount.toFixed(2)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
