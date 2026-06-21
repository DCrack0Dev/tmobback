import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { addToCart } = useCart();
  const { convertPrice, currency } = useCurrency();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      const [productRes, reviewsRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/products/${id}/reviews`)
      ]);
      setProduct(productRes.data);
      setReviews(reviewsRes.data);
      setLoading(false);
    };
    loadProduct();
  }, [id]);

  const colors = product?.specifications?.Colors?.split(', ') || [];

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment
      });
      const response = await api.get(`/products/${id}/reviews`);
      setReviews(response.data);
      setReviewRating(5);
      setReviewComment('');
    } catch (error) {
      console.error('Failed to add review:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">{t('common.loading')}</div>;
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Product Images */}
        <div>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-4">
            <img
              src={product.images?.[selectedImage] || 'https://via.placeholder.com/400'}
              alt={product.name}
              className="w-full h-64 sm:h-80 lg:h-96 object-contain"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                    selectedImage === idx ? 'border-blue-700' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="text-sm text-gray-500 mb-2">{product.brand}</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="text-2xl sm:text-3xl font-bold text-blue-800">
              {currency} {convertPrice(product.price)}
            </span>
            {product.average_rating > 0 && (
              <div className="flex items-center text-yellow-500 text-lg">
                ★ {product.average_rating.toFixed(1)} ({product.review_count})
              </div>
            )}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          {colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Color:</h3>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                      selectedColor === color
                        ? 'border-blue-700 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-blue-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={`mb-6 text-lg font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `${t('products.inStock')}: ${product.stock}` : t('products.outOfStock')}
          </div>

          <button
            onClick={() => addToCart(product.id)}
            disabled={product.stock === 0}
            className="w-full sm:w-auto bg-blue-800 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            {t('common.addToCart')}
          </button>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">{t('products.specifications')}</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="space-y-3">
                {Object.entries(product.specifications || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-gray-200 pb-2 last:border-0">
                    <span className="font-medium text-gray-700">{key}</span>
                    <span className="text-gray-600 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">{t('products.reviews')}</h2>

        {user && (
          <form onSubmit={handleAddReview} className="mb-8 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold mb-4">{t('products.addReview')}</h3>
            <div className="mb-4">
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(parseInt(e.target.value))}
                className="w-full sm:w-auto border rounded-lg px-4 py-2"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Write your review..."
              className="w-full border rounded-lg px-4 py-2 mb-4"
              rows={3}
            />
            <button type="submit" className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Submit Review
            </button>
          </form>
        )}

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">{review.user_name || review.guest_name || 'Anonymous'}</span>
                <span className="text-yellow-500">★ {review.rating}</span>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
