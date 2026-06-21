import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { currency, changeCurrency } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-blue-800 to-blue-600 text-white w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-bold text-xl">
              T
            </div>
            <span className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
              TechNow
            </span>
          </Link>

          {/* Search - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-10">
            <div className="relative w-full">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </form>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-gray-700 hover:text-blue-800 font-semibold transition-colors">
              {t('nav.products')}
            </Link>

            <div className="flex items-center gap-3">
              <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="fr">FR</option>
              </select>

              <select
                value={currency}
                onChange={(e) => changeCurrency(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="ZAR">ZAR</option>
              </select>
            </div>

            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/orders" className="text-gray-700 hover:text-blue-800 font-semibold transition-colors">
                  {t('nav.myOrders')}
                </Link>
                <Link to="/account" className="text-gray-700 hover:text-blue-800 font-semibold transition-colors">
                  {t('nav.account')}
                </Link>
                <button onClick={logout} className="text-gray-600 hover:text-red-600 font-semibold transition-colors">
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-700 hover:text-blue-800 font-semibold transition-colors">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 space-y-4">
            {/* Search - Mobile */}
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={t('common.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-100"
                />
              </div>
            </form>

            <Link
              to="/products"
              className="block py-2 text-gray-700 font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.products')}
            </Link>

            <div className="flex gap-3">
              <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-sm font-semibold"
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="fr">FR</option>
              </select>

              <select
                value={currency}
                onChange={(e) => changeCurrency(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-sm font-semibold"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="ZAR">ZAR</option>
              </select>
            </div>

            {user ? (
              <div className="space-y-2">
                <Link
                  to="/orders"
                  className="block py-2 text-gray-700 font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.myOrders')}
                </Link>
                <Link
                  to="/account"
                  className="block py-2 text-gray-700 font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.account')}
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="block py-2 text-red-600 font-semibold"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block py-2 text-gray-700 font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center bg-gradient-to-r from-blue-800 to-blue-600 text-white px-6 py-3 rounded-xl font-bold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
