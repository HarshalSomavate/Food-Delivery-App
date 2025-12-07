const API_BASE_URL = 'http://localhost:3000/api';

// Generic fetch wrapper
async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }
  
  return response.json();
}

// Auth API
export const authAPI = {
  register: (data) => fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  login: (data) => fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  createGuest: () => fetchAPI('/auth/guest', {
    method: 'POST',
  }),
};

// Restaurant API
export const restaurantAPI = {
  getRestaurant: () => fetchAPI('/restaurant'),
  
  getMenu: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/menu${query ? `?${query}` : ''}`);
  },
};

// Cart API
export const cartAPI = {
  getCart: () => fetchAPI('/cart'),
  
  addToCart: (data) => fetchAPI('/cart', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  updateCartItem: (menuItemId, data) => fetchAPI(`/cart/${menuItemId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  removeFromCart: (menuItemId) => fetchAPI(`/cart/${menuItemId}`, {
    method: 'DELETE',
  }),
  
  clearCart: () => fetchAPI('/cart', {
    method: 'DELETE',
  }),
};

// Orders API
export const orderAPI = {
  createOrder: (data) => fetchAPI('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getOrders: () => fetchAPI('/orders'),
};

// Health check
export const checkHealth = () => fetchAPI('/health');