import { API_URL } from "astro:env/client";
import { getToken, removeToken } from "./token";
import axios from "axios";

export type User = {
  discord_id: string;
  username: string;
  email: string;
  avatar_url: string;
  accessToken: string | null;
};

export const getUser = async (): Promise<User | null> => {
  const user = sessionStorage.getItem("user");

  if (user) return JSON.parse(user);

  const token = getToken();
  if (token) {
    try {
      const user: User = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(user);

      return user;
    } catch (e) {
      removeToken();
      return null;
    }
  }

  return null;
};

export const setUser = (user: User) => {
  sessionStorage.setItem("user", JSON.stringify(user));
};

export const removeUser = () => {
  sessionStorage.removeItem("user");
};
