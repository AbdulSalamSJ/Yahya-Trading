const API_BASE = '/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('choco_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Network request failed');
    }
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),

  // Products & Categories
  getCategories: () => request('/products/categories'),
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.minCocoa) query.append('minCocoa', params.minCocoa);
    if (params.maxCocoa) query.append('maxCocoa', params.maxCocoa);
    if (params.search) query.append('search', params.search);
    if (params.featured) query.append('featured', 'true');
    if (params.sort) query.append('sort', params.sort);
    const qs = query.toString();
    return request(`/products${qs ? `?${qs}` : ''}`);
  },
  getProductBySlug: (slug) => request(`/products/${slug}`),
  addReview: (slug, reviewData) => request(`/products/${slug}/reviews`, { method: 'POST', body: JSON.stringify(reviewData) }),

  // Orders
  createOrder: (orderData) => request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getUserOrders: () => request('/orders/my-orders'),
  trackOrder: (orderNumber) => request(`/orders/track/${orderNumber}`),

  // Payments (Razorpay)
  createPaymentOrder: (payload) => request('/payment/create-order', { method: 'POST', body: JSON.stringify(payload) }),
  verifyPayment: (payload) => request('/payment/verify', { method: 'POST', body: JSON.stringify(payload) }),

  // Admin
  getAdminMetrics: () => request('/admin/metrics'),
  createProduct: (productData) => request('/admin/products', { method: 'POST', body: JSON.stringify(productData) }),
  updateProduct: (id, data) => request(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/admin/products/${id}`, { method: 'DELETE' }),
  getAllOrders: () => request('/admin/orders'),
  updateOrderStatus: (id, status) => request(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) })
};
