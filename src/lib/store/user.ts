/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import axios from "axios";
import { getToken, removeToken } from "./token";
import { API_URL } from "@/lib/env";

export type User = {
  discordId: string | null;
  username: string | null;
  email: string;
  avatarUrl: string | null;
  puuid: string | null;
  gameName: string | null;
  tagLine: string | null;
  linked: boolean;
};

const USER_KEY = "beemobot_user";

export const getUser = async (): Promise<User | null> => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    // localStorage (et non sessionStorage) — sinon la donnée user est perdue
    // à chaque fermeture d'onglet et on refait un /profile/me inutile, et si
    // celui-ci échoue (CORS, 502, réseau) on déconnecte l'utilisateur à tort.
    const cached = window.localStorage.getItem(USER_KEY);
    if (cached) return JSON.parse(cached) as User;

    const token = getToken();
    if (!token) return null;

    try {
      const response = await axios.get(`${API_URL}/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData: User = response.data;
      setUser(userData);
      return userData;
    } catch (e) {
      // On ne supprime le token QUE si l'API rejette explicitement (401/403).
      // Sur erreur réseau / 5xx / CORS, on garde le token : l'utilisateur reste
      // logged-in et un futur appel finira par marcher.
      const status = axios.isAxiosError(e) ? e.response?.status : undefined;
      if (status === 401 || status === 403) {
        removeToken();
        removeUser();
      }
      return null;
    }
  } catch (error) {
    console.error("Error in getUser:", error);
    return null;
  }
};

export const setUser = (user: User) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const removeUser = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(USER_KEY);
  }
};
