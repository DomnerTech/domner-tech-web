import Cookies from "js-cookie";

const TOKEN_KEY = "auth_token";
const TOKEN_EXPIRY_DAYS = 7; // Token expires in 7 days

export const cookieUtils = {
  // Set auth token in cookie
  setToken: (token: string): void => {
    Cookies.set(TOKEN_KEY, token, {
      expires: TOKEN_EXPIRY_DAYS,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
  },

  // Get auth token from cookie
  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_KEY);
  },

  // Remove auth token from cookie
  removeToken: (): void => {
    Cookies.remove(TOKEN_KEY);
  },

  // Check if token exists
  hasToken: (): boolean => {
    return !!Cookies.get(TOKEN_KEY);
  },
};
