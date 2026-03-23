import { http } from "@/lib/http";
import type { LoginRequest, LoginResponse, LoginResponseData } from "../types";

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponseData> => {
    const response = await http.post<LoginResponse>("/auth/login", credentials);
    // Return the data from BaseResponse
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await http.post("/auth/logout");
  },
};
