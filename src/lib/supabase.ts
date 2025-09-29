// API client for authentication and data management
import { apiClient } from './api';

// Export the API client methods for compatibility
export const signIn = async (email: string, password: string) => {
  try {
    const result = await apiClient.signIn(email, password);
    return result;
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
};

export const signUp = async (email: string, password: string, fullName: string, role: string) => {
  try {
    const result = await apiClient.signUp(email, password, fullName, role);
    return result;
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
};

export const signOut = async () => {
  try {
    const result = apiClient.signOut();
    return result;
  } catch (error: any) {
    return { error: { message: error.message } };
  }
};

export const getCurrentUser = async () => {
  const { data } = await apiClient.getUser();
  return data.user;
};

export const getCurrentUserProfile = async () => {
  const user = await getCurrentUser();
  if (!user) return { data: null, error: null };

  return { data: user.profile, error: null };
};

// Create a mock supabase object for compatibility
export const supabase = {
  auth: {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      return signIn(email, password);
    },
    signUp: async ({ email, password, options }: { email: string; password: string; options?: any }) => {
      return signUp(email, password, options?.data?.fullName || '', options?.data?.role || 'mechanic');
    },
    signOut: async () => {
      return signOut();
    },
    getUser: async () => {
      const user = await getCurrentUser();
      return { data: { user }, error: null };
    },
    getSession: async () => {
      return apiClient.getSession();
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      return apiClient.onAuthStateChange(callback);
    }
  },
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => ({ data: null, error: null })
      }),
      order: (column: string, options?: any) => ({
        limit: (count: number) => ({ data: [], error: null })
      }),
      limit: (count: number) => ({ data: [], error: null }),
      data: [],
      error: null
    }),
    insert: (data: any) => ({ data: null, error: null }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({ data: null, error: null })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({ data: null, error: null })
    })
  })
};