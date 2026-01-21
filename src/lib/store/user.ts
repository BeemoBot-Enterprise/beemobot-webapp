import axios from "axios";
import { getToken, removeToken } from "./token";

export type User = {
  discord_id: string;
  username: string;
  email: string;
  avatar_url: string;
  accessToken: string | null;
};

export const getUser = async (): Promise<User | null> => {
  // Ensure we're only running in the browser
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const user = window.sessionStorage.getItem("user");
    if (user) return JSON.parse(user);

    const token = getToken();
    if (token) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || process.env.API_URL}/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const userData: User = response.data;
        setUser(userData);

        return userData;
      } catch (e) {
        removeToken();
        return null;
      }
    }

    return null;
  } catch (error) {
    console.error("Error in getUser:", error);
    return null;
  }
};

export const setUser = (user: User) => {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem("user", JSON.stringify(user));
  }
};

export const removeUser = () => {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem("user");
  }
};
