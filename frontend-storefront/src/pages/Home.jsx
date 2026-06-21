import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

const Home = () => {
  const { t } = useTranslation();
  const { convertPrice, currency } = useCurrency();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [featuredRes, newRes] = await Promise.all([
          api.get('/products?limit=4&is_featured=true'),
          api.get('/products?limit=4&sort=newest')
        ]);
        setFeaturedProducts(featuredRes.data.products || []);
        setNewArrivals(newRes.data.products || []);
      } catch (err) {
        console.error('Error loading products:', err);
        setFeaturedProducts([]);
        setNewArrivals([]);
      }
    };
    loadProducts();
  }, []);

  const ProductCard = ({ product }) => (
    <Link
      key={product.id}
      to={`/products/${product.id}`}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100"
    >
      <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
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
      <div className="p-6">
        <div className="text-sm text-blue-600 font-medium mb-2 uppercase tracking-wider">{product.brand}</div>
        <h3 className="font-bold text-lg text-gray-900 mb-3 leading-tight">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-900">
            {currency} {convertPrice(product.price)}
          </span>
          {product.average_rating > 0 && (
            <div className="flex items-center space-x-1">
              <div className="flex text-yellow-400">
                ★
              </div>
              <span className="text-gray-700 font-semibold">{product.average_rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );

  return (
    <div>
      <div className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 rounded-3xl p-8 md:p-16 mb-16 text-white overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=1600&h=800&fit=crop')] opacity-10 bg-cover bg-center"></div>
        <div className="relative max-w-4xl">
          <div className="inline-block bg-blue-700/30 backdrop-blur-sm text-blue-200 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-blue-500/30">
            2025 Collection
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Next-Gen Devices
            <br />
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Premium Experience
            </span>
          </h1>
          <p className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl leading-relaxed">
            Discover the latest flagship smartphones from Apple, Samsung, Huawei, and Oppo. 
            Cutting-edge technology, stunning designs, and unbeatable performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center bg-white text-blue-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Explore Now
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              to="/products?brand=Apple"
              className="inline-flex items-center justify-center border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
            >
              Shop Apple
            </Link>
          </div>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop" 
            alt="Hero" 
            className="h-full w-full object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      <section className="mb-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900">{t('home.featured')}</h2>
            <p className="text-gray-500 mt-2">Our most popular premium devices</p>
          </div>
          <Link 
            to="/products?is_featured=true" 
            className="text-blue-800 font-semibold hover:text-blue-700 flex items-center transition-colors"
          >
            View All
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.filter(p => p).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mb-16">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900">{t('home.newArrivals')}</h2>
              <p className="text-gray-500 mt-2">The latest devices just arrived</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.filter(p => p).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
            <p className="opacity-90">On all orders over $500</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-white shadow-xl hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-2">2 Year Warranty</h3>
            <p className="opacity-90">On all premium devices</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-8 text-white shadow-xl hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2">Secure Checkout</h3>
            <p className="opacity-90">256-bit SSL encryption</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
