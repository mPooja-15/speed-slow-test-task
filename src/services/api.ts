const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Response types
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// For auth endpoints that return user and token directly
interface AuthApiResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'user' | 'admin';
  };
  token: string;
}

interface LoginResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'user' | 'admin';
  };
  token: string;
}

interface SignupResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'user' | 'admin';
  };
  token: string;
}

interface OrderResponse {
  _id: string;
  orderNumber: string;
  user: string;
  items: Array<{
    product: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  status: string;
  isPaid: boolean;
  createdAt: string;
}

// Helper function to make API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    // Log warning for protected endpoints
    if (endpoint.includes('/orders') || endpoint.includes('/auth/me')) {
      console.warn('No authentication token found for protected endpoint:', endpoint);
    }
  }

  const config: RequestInit = {
    headers,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle authentication errors specifically
      if (response.status === 401) {
        // Clear invalid token
        throw new Error('Authentication required. Please log in again.');
      } else if (response.status === 404) {
        throw new Error(`Endpoint not found: ${endpoint}`);
      }
      
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Authentication API functions
export const authAPI = {
  // Login user
  login: async (email: string, password: string): Promise<AuthApiResponse> => {
    return apiCall<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }) as Promise<AuthApiResponse>;
  },

  // Register user
  signup: async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<AuthApiResponse> => {
    return apiCall<SignupResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
    }) as Promise<AuthApiResponse>;
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<any>> => {
    return apiCall('/auth/me');
  },

  // Update user profile
  updateProfile: async (userData: any): Promise<ApiResponse<any>> => {
    return apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Validate current token
  validateToken: async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }
      
      const response = await apiCall('/auth/me');
      return response.success;
    } catch (error) {
      console.log('Token validation failed:', error);
      return false;
    }
  },
};

// Health check function
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

// Order API functions
export const orderAPI = {
  // Create new order
  createOrder: async (orderData: {
    items: Array<{
      product: string;
      quantity: number;
    }>;
    shippingAddress: {
      firstName: string;
      lastName: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    paymentMethod: string;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
  }): Promise<ApiResponse<OrderResponse>> => {
    return apiCall<OrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Get user orders
  getUserOrders: async (): Promise<ApiResponse<OrderResponse[]>> => {
    return apiCall<OrderResponse[]>('/orders/myorders');
  },

  // Get specific order
  getOrder: async (orderId: string): Promise<ApiResponse<OrderResponse>> => {
    return apiCall<OrderResponse>(`/orders/${orderId}`);
  },

  // Cancel order
  cancelOrder: async (orderId: string): Promise<ApiResponse<any>> => {
    return apiCall(`/orders/${orderId}/cancel`, {
      method: 'PUT',
    });
  },
};

// Product API functions
export const productAPI = {
  // Get all products
  getProducts: async (params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any[]>> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString());
      });
    }
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    
    return apiCall<any[]>(endpoint);
  },

  // Get product by ID
  getProduct: async (productId: string): Promise<ApiResponse<any>> => {
    return apiCall<any>(`/products/${productId}`);
  },
};

export default {
  auth: authAPI,
  order: orderAPI,
  product: productAPI,
}; 