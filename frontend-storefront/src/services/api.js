import axios from 'axios';

const debugPost = (hypothesisId, location, msg, data = {}) => {
  // #region debug-point A:storefront-api
  fetch('http://127.0.0.1:7777/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'products-load-failure',
      runId: 'pre-fix',
      hypothesisId,
      location,
      msg: `[DEBUG] ${msg}`,
      data,
      ts: Date.now()
    })
  }).catch(() => {});
  // #endregion
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://tmobback.vercel.app/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // #region debug-point A:storefront-request
  debugPost('A', 'frontend-storefront/src/services/api.js:request', 'storefront request', {
    baseURL: config.baseURL,
    url: config.url,
    method: config.method,
    hasToken: Boolean(token)
  });
  // #endregion
  return config;
});

api.interceptors.response.use(
  (response) => {
    // #region debug-point D:storefront-response
    debugPost('D', 'frontend-storefront/src/services/api.js:response', 'storefront response', {
      url: response.config?.url,
      status: response.status,
      productCount: Array.isArray(response.data?.products) ? response.data.products.length : null,
      keys: response.data ? Object.keys(response.data) : []
    });
    // #endregion
    return response;
  },
  (error) => {
    // #region debug-point B:storefront-error
    debugPost('B', 'frontend-storefront/src/services/api.js:error', 'storefront response error', {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      message: error.message,
      code: error.code,
      status: error.response?.status,
      responseData: error.response?.data ?? null
    });
    // #endregion
    return Promise.reject(error);
  }
);

export default api;
