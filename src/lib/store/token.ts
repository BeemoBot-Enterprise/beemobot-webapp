const TOKEN_KEY = "beemobot_token";

export const getToken = () => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOKEN_KEY, token);
  }
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
  }
};
