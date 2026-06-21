import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
      setLoading(false);
    };
    loadOrder();
  }, [id]);

  const handleVerifyPayment = async () => {
    await api.put(`/admin/orders/${id}/verify-payment`);
    const response = await api.get(`/orders/${id}`);
    setOrder(response.data);
  };

  const handleUpdateStatus = async (status) => {
    await api.put(`/admin/orders/${id}/status`, { status });
    const response = await api.get(`/orders/${id}`);
    setOrder(response.data);
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const statusColors = {
    pending_payment: 'text-yellow-600 bg-yellow-50',
    payment_submitted: 'text-blue-600 bg-blue-50',
    paid: 'text-indigo-600 bg-indigo-50',
    shipped: 'text-purple-600 bg-purple-50',
    delivered: 'text-green-600 bg-green-50',
    cancelled: 'text-red-600 bg-red-50'
  };

  return (
    <div>
      <button
        onClick={() => navigate('/orders')}
        className="text-blue-600 hover:underline mb-6"
      >
        &larr; Back to Orders
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold">Order #{order.id}</h1>
                <p className="text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
              </div>
              <span className={`px-4 py-2 rounded-full font-semibold ${statusColors[order.status]}`}>
                {order.status.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Customer</h3>
                <p>Name: {order.guest_name || 'N/A'}</p>
                <p>Email: {order.guest_email || 'N/A'}</p>
                <p>Phone: {order.guest_phone || 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p>{order.shipping_address.address}</p>
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state}{' '}
                  {order.shipping_address.postal_code}
                </p>
                <p>{order.shipping_address.country}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Payment</h3>
              <p>Total: ${order.total_amount.toFixed(2)}</p>
              <p>USDT: {order.crypto_amount.toFixed(6)} USDT</p>
              {order.transaction_hash && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Transaction Hash:</p>
                  <a
                    href={`https://tronscan.org/#/transaction/${order.transaction_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {order.transaction_hash}
                  </a>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {order.status === 'payment_submitted' && (
                <button
                  onClick={handleVerifyPayment}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Verify Payment
                </button>
              )}
              {order.status === 'paid' && (
                <button
                  onClick={() => handleUpdateStatus('shipped')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Mark as Shipped
                </button>
              )}
              {order.status === 'shipped' && (
                <button
                  onClick={() => handleUpdateStatus('delivered')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Mark as Delivered
                </button>
              )}
              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <button
                  onClick={() => handleUpdateStatus('cancelled')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    {item.images?.[0] && (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
