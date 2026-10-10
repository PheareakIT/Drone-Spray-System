const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // sends cookies
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

// Auth API
export const authApi = {
  signin: (credentials) =>
    apiRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  signup: (userData) =>
    apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  signout: () =>
    apiRequest('/auth/signout', {
      method: 'POST',
    }),
  getMe: () => apiRequest('/auth/me'),
};

// Customer API
export const customerApi = {
  getAll: () => apiRequest('/customers'),
  getById: (id) => apiRequest(`/customers/${id}`),
  create: (data) =>
    apiRequest('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiRequest(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiRequest(`/customers/${id}`, {
      method: 'DELETE',
    }),
};

// SprayList API
export const sprayApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (typeof filters === 'string') {
      if (filters) params.append('customer', filters);
    } else if (filters && typeof filters === 'object') {
      if (filters.customer) params.append('customer', filters.customer);
      if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/spray-lists${query}`);
  },
  getById: (id) => apiRequest(`/spray-lists/${id}`),
  create: (data) =>
    apiRequest('/spray-lists', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiRequest(`/spray-lists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiRequest(`/spray-lists/${id}`, {
      method: 'DELETE',
    }),
};

// User API (Admin/Super)
export const userApi = {
  getAll: () => apiRequest('/users'),
  getById: (id) => apiRequest(`/users/${id}`),
  create: (data) =>
    apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiRequest(`/users/${id}`, {
      method: 'DELETE',
    }),
};
