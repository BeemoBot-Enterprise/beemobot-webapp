import { useEffect, useState } from "react";
import { getUser, setUser, removeUser, type User } from "@/lib/store/user";
import { getToken, setToken, removeToken } from "@/lib/store/token";
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
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.API_URL ||
      "http://localhost:65397";
    window.location.href = `${apiUrl}/auth/discord/redirect`;
  };

  const logout = () => {
    removeToken();
    removeUser();
    setUserState(null);
    router.push("/");
  };

  const handleCallback = (token: string) => {
    setToken(token);
    // Le getUser sera appelé automatiquement pour récupérer les infos
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
