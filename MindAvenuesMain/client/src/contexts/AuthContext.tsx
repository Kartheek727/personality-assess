//src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useDispatch, useAppSelector } from "../redux/hooks";
import { fetchProfile, logoutUser } from "../features/auth/authApi";
import { UserRole, PaymentStatus, IUser } from "../types/backendTypes";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPaid: boolean;
  loading: boolean;
  logout: () => void;
  user: IUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAppSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const publicPaths = [
        "/",
        "/about",
        "/terms-and-conditions",
        "/privacy-policy",
        "/shipping-policy",
        "/contact-us",
        "/cancellation-and-refunds",
        "/login",
        "/register",
        "/verify",
        "/forgot-password", // Added
        "/verify-otp", // Added
        "/password-changed", // Added
      ];

      if (publicPaths.includes(pathname)) {
        setIsInitialized(true);
        return;
      }

      if (!user) {
        try {
          await dispatch(fetchProfile()).unwrap();
        } catch (error) {
          console.error("Initial profile fetch failed:", error);
          router.push("/login");
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, [dispatch, router, pathname]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === UserRole.ADMIN;
  const isPaid = user?.paymentStatus === PaymentStatus.COMPLETED;

  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/login");
    }
  };

  if (!isInitialized) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, isPaid, loading, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};