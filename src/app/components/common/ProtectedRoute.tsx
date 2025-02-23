"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { isAuthenticated, getUser } from '../../utils/auth';
import {isAuthenticated,getUser} from "../../utils/auth"

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      if (allowedRoles.length > 0) {
        const user = getUser();
        if (!user || !allowedRoles.includes(user.role)) {
          router.push('/unauthorized');
        }
      }
    };

    checkAuth();
  }, [router, allowedRoles]);

  return <>{children}</>;
}
