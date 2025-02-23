import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JwtPayload {
  userId: string;
  role: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const auth = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    next();
  };
};

export function middleware(request: NextRequest) {
  // Get stored token and user data
  const token = request.cookies.get('token')?.value;
  const userStr = request.cookies.get('user')?.value;

  // If trying to access protected routes without being logged in
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/admin')) {
    
    if (!token || !userStr) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const user = JSON.parse(userStr);
      
      // If trying to access admin routes without admin role
      if (request.nextUrl.pathname.startsWith('/admin') && user.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // If admin trying to access user dashboard
      if (request.nextUrl.pathname === '/dashboard' && user.role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
};