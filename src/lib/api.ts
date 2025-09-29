// API client for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Auth endpoints
  async signIn(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.setToken(response.token);
    return { data: { user: response.user }, error: null };
  }

  async signUp(email: string, password: string, fullName: string, role: string) {
    const response = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName, role }),
    });
    return { data: response, error: null };
  }

  signOut() {
    this.setToken(null);
    return { error: null };
  }

  async getUser() {
    if (!this.token) return { data: { user: null } };
    
    try {
      const response = await this.request<{ user: any }>('/auth/me');
      return { data: { user: response.user } };
    } catch (error) {
      this.setToken(null);
      return { data: { user: null } };
    }
  }

  async getSession() {
    const { data } = await this.getUser();
    return { data: { session: data.user ? { user: data.user } : null } };
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    // Simple implementation - in a real app you'd want more sophisticated state management
    const checkAuth = async () => {
      const { data } = await this.getUser();
      callback(data.user ? 'SIGNED_IN' : 'SIGNED_OUT', data.user ? { user: data.user } : null);
    };
    
    checkAuth();
    
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }

  // Customer endpoints
  async getCustomers() {
    return this.request('/customers');
  }

  async getCustomer(id: string) {
    return this.request(`/customers/${id}`);
  }

  async createCustomer(data: any) {
    return this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCustomer(id: string, data: any) {
    return this.request(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCustomer(id: string) {
    return this.request(`/customers/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);