import type { BaseResponse } from "@/types/api";

export interface LoginRequest {
  username: string;
  pwd: string;
}

export interface LoginResponseData {
  token: string;
  user: User;
}

export type LoginResponse = BaseResponse<LoginResponseData>;

export interface User {
  id: string;
  username: string;
  email?: string;
  role?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}
