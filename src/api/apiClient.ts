
/**
 * API Client for making requests to the backend
 * 
 * In a real app, this would connect to your actual backend.
 * For now, we'll use localStorage for persistence to demonstrate
 * how this would work in a real environment.
 */

import { BadgeEntry, UserEntry, UserPlannedDays } from "@/lib/types";

// Base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Utility for making API requests
const fetchWithAuth = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<Response> => {
  // In a real app, you'd get this from an auth context
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// General API request methods
export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetchWithAuth(endpoint);
    return response.json();
  },
  
  post: async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await fetchWithAuth(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  put: async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await fetchWithAuth(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetchWithAuth(endpoint, {
      method: 'DELETE',
    });
    return response.json();
  },
};
