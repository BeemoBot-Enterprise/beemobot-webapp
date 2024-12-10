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
  if (typeof window === "undefined") {
    return null; // Return null during server-side rendering
  }

  const user = sessionStorage.getItem("user");

  if (user) return JSON.parse(user);

  const token = getToken();
  if (token) {
    try {
      const response = await axios.get(`${process.env.API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData: User = response.data;
      setUser(userData);

      return userData;
    } catch (e) {
      removeToken();
      return null;
    }
  }

  return null;
};

export const setUser = (user: User) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("user", JSON.stringify(user));
  }
};

export const removeUser = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("user");
  }
};
