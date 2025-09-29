// Backend API client for authentication
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class AuthClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
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

  async getSession() {
    const { data } = await this.getUser();
    return { data: { session: data.user ? { user: data.user } : null } };
  }
}

// Create a singleton instance
export const supabase = new AuthClient();

// Export helper functions for compatibility
export const signIn = async (email: string, password: string) => {
  return supabase.signIn(email, password);
};

export const signUp = async (email: string, password: string, fullName: string, role: string) => {
  return supabase.signUp(email, password, fullName, role);
};

export const signOut = async () => {
  return supabase.signOut();
};

export const getCurrentUser = async () => {
  const { data } = await supabase.getUser();
  return data.user;
};

export const getCurrentUserProfile = async () => {
  const user = await getCurrentUser();
  if (!user) return { data: null, error: null };

  // Return the user profile from the user object
  return { data: user.profile, error: null };
};