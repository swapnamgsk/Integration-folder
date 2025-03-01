"use client";

const API_BASE_URL = 'http://localhost:50001';

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

export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

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
    const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
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
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
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
  role?: string;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();
    return {
      success: true,
      message: 'Registration successful',
      user: data.user
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

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
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
