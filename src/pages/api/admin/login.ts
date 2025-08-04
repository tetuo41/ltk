import type { APIRoute } from 'astro';
import { verifyAdminPassword, generateSessionToken } from '@/utils/adminAuth';

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type');
    let password: string = '';

    if (contentType?.includes('application/json')) {
      const body = await request.json();
      password = body.password;
    } else {
      const formData = await request.formData();
      password = formData.get('password') as string;
    }

    if (!password) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing password',
        message: 'Password is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (verifyAdminPassword(password)) {
      const token = generateSessionToken();
      
      return new Response(JSON.stringify({
        success: true,
        token,
        message: 'Authentication successful',
        expiresIn: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Set-Cookie': `ltk-admin-token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/`
        }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid credentials',
        message: 'Incorrect password'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Server error',
      message: 'An error occurred during authentication'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    success: false,
    error: 'Method not allowed',
    message: 'Use POST method for authentication'
  }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
};