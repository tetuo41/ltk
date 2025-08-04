// Simple admin authentication utilities

export interface AdminSession {
  isAuthenticated: boolean;
  expiresAt: number;
}

const ADMIN_PASSWORD = import.meta.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Verify admin password
 */
export function verifyAdminPassword(password: string): boolean {
  if (!ADMIN_PASSWORD) {
    console.warn('Admin password not configured');
    return false;
  }
  return password === ADMIN_PASSWORD;
}

/**
 * Generate admin session token (simple JWT-like structure)
 */
export function generateSessionToken(): string {
  const payload = {
    iat: Date.now(),
    exp: Date.now() + SESSION_DURATION,
    role: 'admin'
  };
  
  // Simple base64 encoding (not cryptographically secure, but sufficient for basic auth)
  return btoa(JSON.stringify(payload));
}

/**
 * Verify session token
 */
export function verifySessionToken(token: string): AdminSession {
  try {
    const payload = JSON.parse(atob(token));
    
    if (payload.exp && payload.exp > Date.now() && payload.role === 'admin') {
      return {
        isAuthenticated: true,
        expiresAt: payload.exp
      };
    }
  } catch (error) {
    // Invalid token format
  }
  
  return {
    isAuthenticated: false,
    expiresAt: 0
  };
}

/**
 * Check authorization header from API request
 */
export function checkAuthHeader(authHeader: string | null): boolean {
  if (!authHeader) return false;
  
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const session = verifySessionToken(token);
    return session.isAuthenticated;
  }
  
  if (authHeader.startsWith('Basic ')) {
    try {
      const credentials = atob(authHeader.substring(6));
      const [username, password] = credentials.split(':');
      return username === 'admin' && verifyAdminPassword(password);
    } catch {
      return false;
    }
  }
  
  return false;
}

/**
 * Middleware-like function for API route authentication
 */
export function requireAuth(authHeader: string | null): Response | null {
  if (!checkAuthHeader(authHeader)) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Unauthorized',
      message: 'Admin authentication required'
    }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'WWW-Authenticate': 'Basic realm="LTK Admin", Bearer'
      }
    });
  }
  
  return null; // Authentication successful
}

/**
 * Client-side session management
 */
export const clientAuth = {
  setSession(token: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('ltk-admin-token', token);
    }
  },
  
  getSession(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('ltk-admin-token');
    }
    return null;
  },
  
  clearSession() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('ltk-admin-token');
    }
  },
  
  isAuthenticated(): boolean {
    const token = this.getSession();
    if (!token) return false;
    
    const session = verifySessionToken(token);
    if (!session.isAuthenticated) {
      this.clearSession();
      return false;
    }
    
    return true;
  }
};