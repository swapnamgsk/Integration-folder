"use client";

const API_URL = 'http://localhost:5000/api';

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    role: string;
    username: string;
  };
  message?: string;
}

export async function loginUser(credentials: { email: string; password: string }): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include', // This is important for cookies
    });

    const data = await response.json();

    if (response.ok) {
      // Store token in sessionStorage for subsequent requests
      if (data.token) {
        sessionStorage.setItem('token', data.token);
      }
      return data;
    } else {
      return {
        success: false,
        message: data.message || 'Login failed'
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Authentication failed'
    };
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('token');
  }
  return null;
}

export async function isAuthenticated(): Promise<boolean> {
  const token = getToken();
  if (!token) return false;

  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function getUserRole(): Promise<string | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.user.role;
    }
    return null;
  } catch {
    return null;
  }
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('token');
  }
}

export async function registerUser(userData: { 
  username: string;
  email: string; 
  password: string; 
}): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store token in localStorage or cookies if needed
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return {
      success: true,
      ...data
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred during registration'
    };
  }
}

export async function getUserInfo(): Promise<AuthResponse> {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get user info');
    }

    return {
      success: true,
      ...data
    };
  } catch (error: any) {
    console.error('Get user info error:', error);
    return {
      success: false,
      message: error.message || 'Failed to get user information'
    };
  }
}
