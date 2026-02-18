import api from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone?: string;
  avatar?: string;
  created_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout/');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await api.put('/auth/profile/update/', userData);
    return response.data;
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
};
