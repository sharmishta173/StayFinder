import api from './api';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: 'guest' | 'host';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'guest' | 'host';
  profilePicture?: string;
  phoneNumber?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

const authService = {
  // Register a new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/register', userData);
      // Ensure we have a valid response with token and user
      if (response.data && response.data.token && response.data.user) {
        // Store token and user data in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      } else {
        console.error('Invalid registration response:', response.data);
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Registration service error:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', credentials);
      // Ensure we have a valid response with token and user
      if (response.data && response.data.token && response.data.user) {
        // Store token and user data in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      } else {
        console.error('Invalid login response:', response.data);
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  },

  // Logout user
  logout: (): void => {
    // Remove token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put('/users/me', userData);
    // Update user data in localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, ...response.data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return response.data;
  },

  // Change password
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> => {
    const response = await api.put('/users/me/password', data);
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Get user from localStorage
  getUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;