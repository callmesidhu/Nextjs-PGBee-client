"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAccessToken } from "@/utils/auth";

// Routes that don't require authentication (only auth pages)
const publicRoutes = ["/auth/login", "/auth/signup"];

export default function AuthGuard({ children }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const token = getAccessToken();
    setIsAuthenticated(!!token);
    setIsLoading(false);

    // If user is authenticated and tries to access auth pages, redirect to home
    if (token && publicRoutes.includes(pathname)) {
      router.push("/");
      return;
    }

    // If user is not authenticated and tries to access any route except auth pages, redirect to signup
    if (!token && !publicRoutes.includes(pathname)) {
      router.push("/auth/signup");
      return;
    }
  }, [pathname, isMounted, router]);

  // Show loading spinner until authentication check is complete
  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and trying to access protected route, don't render content
  if (!isAuthenticated && !publicRoutes.includes(pathname)) {
    return null; // Will redirect to login
  }

  // If authenticated and trying to access auth routes, don't render content
  if (isAuthenticated && publicRoutes.includes(pathname)) {
    return null; // Will redirect to home
  }

  return <>{children}</>;
}
