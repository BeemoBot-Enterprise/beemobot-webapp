/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import { useEffect, useState } from "react";
import { getUser, removeUser, type User } from "@/lib/store/user";
import { setToken, removeToken } from "@/lib/store/token";
import { API_URL } from "@/lib/env";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await getUser();
        setUserState(userData);
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = () => {
    window.location.href = `${API_URL}/auth/discord/redirect`;
  };

  const logout = () => {
    removeToken();
    removeUser();
    setUserState(null);
    router.push("/");
  };

  const handleCallback = (token: string) => {
    setToken(token);
  };

  return {
    user,
    loading,
    login,
    logout,
    handleCallback,
    isAuthenticated: !!user,
  };
};
