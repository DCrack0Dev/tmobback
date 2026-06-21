import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white shadow-lg">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-blue-400">TechNow Admin</h1>
      </div>

      <nav className="p-4 space-y-2">
        <Link
          to="/"
          className={`block px-4 py-3 rounded-lg transition ${
            isActive('/') ? 'bg-blue-800' : 'hover:bg-slate-800'
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/products"
          className={`block px-4 py-3 rounded-lg transition ${
            isActive('/products') ? 'bg-blue-800' : 'hover:bg-slate-800'
          }`}
        >
          Products
        </Link>
        <Link
          to="/orders"
          className={`block px-4 py-3 rounded-lg transition ${
            isActive('/orders') ? 'bg-blue-800' : 'hover:bg-slate-800'
          }`}
        >
          Orders
        </Link>
        <Link
          to="/customers"
          className={`block px-4 py-3 rounded-lg transition ${
            isActive('/customers') ? 'bg-blue-800' : 'hover:bg-slate-800'
          }`}
        >
          Customers
        </Link>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
        <button
          onClick={logout}
          className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
