import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

const Products = () => {
  const { t } = useTranslation();
  const { convertPrice, currency } = useCurrency();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (brand) params.set('brand', brand);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (sort) params.set('sort', sort);
        if (search) params.set('search', search);

        const response = await api.get(`/products?${params.toString()}`);
        setProducts(response.data.products);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [brand, minPrice, maxPrice, sort, search]);

  const brands = ['Apple', 'Samsung', 'Huawei', 'Oppo'];

  if (loading) {
    return <div className="text-center py-12 text-gray-500 text-xl">{t('common.loading')}</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-800 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      {/* Filter Toggle Button (Mobile Only) */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-xl font-semibold shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {filtersOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filters Sidebar */}
      <aside className={`lg:w-72 flex-shrink-0 ${filtersOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-24">
          <h3 className="font-extrabold text-xl mb-6 text-gray-900">{t('products.filters')}</h3>

          <div className="mb-6">
            <label className="block font-semibold mb-3 text-gray-700">{t('products.brand')}</label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-3 text-gray-700">{t('products.priceRange')}</label>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-3 text-gray-700">{t('products.sortBy')}</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="newest">{t('products.newest')}</option>
              <option value="price_asc">{t('products.priceAsc')}</option>
              <option value="price_desc">{t('products.priceDesc')}</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Products Grid */}
      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
            >
              <div className="relative h-48 sm:h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                {product.images?.[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="h-full w-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-gray-400">No Image</div>
                )}
                {product.is_featured && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-800 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="text-sm text-blue-600 font-medium mb-2 uppercase tracking-wider">{product.brand}</div>
                <h3 className="font-bold text-lg text-gray-900 mb-3 leading-tight">{product.name}</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-blue-900">
                    {currency} {convertPrice(product.price)}
                  </span>
                  {product.average_rating > 0 && (
                    <div className="flex items-center space-x-1">
                      <div className="flex text-yellow-400">★</div>
                      <span className="text-gray-700 font-semibold">{product.average_rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <div className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? t('products.inStock') : t('products.outOfStock')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
