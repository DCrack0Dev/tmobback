import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const OrderConfirmation = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [transactionHash, setTransactionHash] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        console.error('Failed to load order:', err);
        setError('Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  const handleSubmitHash = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      await api.post(`/orders/${id}/transaction-hash`, { transaction_hash: transactionHash });
      setSubmitted(true);
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (err) {
      console.error('Failed to submit hash:', err);
      setError('Failed to submit transaction hash');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">{t('common.loading')}</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12 px-4">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-800 text-white px-6 py-3 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-white rounded-xl shadow-md p-8 text-center mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('orderConfirmation.title')}</h1>
        <p className="text-gray-600 mb-6">
          {t('orderConfirmation.orderNumber')}: <span className="font-bold">#{order.id}</span>
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">{t('orderConfirmation.paymentInstructions')}</h2>
        <div className="space-y-4">
          <p className="text-lg">
            {t('orderConfirmation.totalUsd')}: <span className="font-bold">${order.total_amount.toFixed(2)}</span>
          </p>
          <p className="text-lg">
            {t('orderConfirmation.totalUsdt')}: <span className="font-bold">{order.crypto_amount.toFixed(6)} USDT</span>
          </p>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-medium mb-2">{t('orderConfirmation.walletAddress')}</p>
            <p className="font-mono text-sm break-all">{order.wallet_address}</p>
            <div className="mt-4 flex justify-center">
              <img src={order.qr_code} alt="QR Code" className="w-48 h-48" />
            </div>
          </div>

          <ol className="list-decimal list-inside space-y-2">
            <li>{t('orderConfirmation.step1')} <span className="font-bold">{order.crypto_amount.toFixed(6)}</span> {t('orderConfirmation.step1b')}</li>
            <li>{t('orderConfirmation.step2')}</li>
            <li>{t('orderConfirmation.step3')}</li>
          </ol>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {order.status !== 'payment_submitted' && order.status !== 'paid' && !submitted ? (
        <div className="bg-white rounded-xl shadow-md p-6">
          <form onSubmit={handleSubmitHash}>
            <label className="block font-medium mb-2">{t('orderConfirmation.transactionHash')}</label>
            <input
              type="text"
              required
              value={transactionHash}
              onChange={(e) => setTransactionHash(e.target.value)}
              className="w-full border rounded px-4 py-2 mb-4 rounded-lg"
              placeholder="0x..."
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-800 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold"
            >
              {submitting ? 'Submitting...' : t('orderConfirmation.submit')}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="text-green-600 font-semibold">
            {submitted ? t('common.success') : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
