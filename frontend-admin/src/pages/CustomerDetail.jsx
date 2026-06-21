import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [customersRes, ordersRes] = await Promise.all([
        api.get('/admin/customers'),
        api.get(`/admin/customers/${id}/orders`)
      ]);
      setCustomer(customersRes.data.find(c => c.id === parseInt(id)));
      setOrders(ordersRes.data);
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <button
        onClick={() => navigate('/customers')}
        className="text-blue-600 hover:underline mb-6"
      >
        &larr; Back to Customers
      </button>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">{customer.name}</h1>
        <p className="text-gray-600">Email: {customer.email}</p>
        <p className="text-gray-600">Phone: {customer.phone || 'N/A'}</p>
        <p className="text-gray-600">Joined: {new Date(customer.created_at).toLocaleDateString()}</p>
      </div>

      <h2 className="text-xl font-bold mb-4">Orders ({orders.length})</h2>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
          No orders yet
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 font-medium">#{order.id}</td>
                  <td className="px-6 py-4">${order.total_amount.toFixed(2)}</td>
                  <td className="px-6 py-4 capitalize">{order.status.replace('_', ' ')}</td>
                  <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerDetail;
