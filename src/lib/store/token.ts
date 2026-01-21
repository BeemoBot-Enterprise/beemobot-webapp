export const getToken = () => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("token");
  }
  return null;
};

export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("token", token);
  }
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("token");
  }
};
