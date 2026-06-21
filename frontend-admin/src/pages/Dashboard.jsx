import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const response = await api.get('/admin/stats');
      setStats(response.data);
      setLoading(false);
    };
    loadStats();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const cards = [
    { label: 'Total Orders', value: stats.total_orders, color: 'blue' },
    { label: 'Total Revenue', value: `$${stats.total_revenue.toFixed(2)}`, color: 'green' },
    { label: 'Pending Orders', value: stats.pending_orders, color: 'yellow' },
    { label: 'Total Products', value: stats.total_products, color: 'purple' }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md p-6">
            <div className="text-gray-500 text-sm mb-2">{card.label}</div>
            <div className="text-3xl font-bold text-slate-900">{card.value}</div>
          </div>
        ))}
      </div>

      {stats.monthly_data?.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {stats.monthly_data.map((data, idx) => (
              <div key={idx} className="flex justify-between items-center border-b pb-3">
                <div className="font-medium">{data.month}</div>
                <div className="flex gap-6">
                  <span>Orders: {data.count}</span>
                  <span className="font-bold text-green-600">${data.revenue.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
