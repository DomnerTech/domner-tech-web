import axios, { AxiosResponse } from "axios";
import { cookieUtils } from "./cookies";
import { ApiError, BaseResponse } from "@/types/api";

// Create axios instance with default config
export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Automatically send cookies with requests
});

// Response interceptor
http.interceptors.response.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (response: AxiosResponse<BaseResponse<any>>) => {
    const data = response.data;

    // Check if response follows BaseResponse structure
    if (data && typeof data === "object" && "status" in data) {
      // Check if the response is successful based on backend logic
      if (!data.isSuccess) {
        // Backend returned error in successful HTTP response
        throw new ApiError(
          data.status.statusCode,
          data.status.errorCode,
          data.status.desc,
          data.status.errors,
          response,
        );
      }
    }

    return response;
  },
  (error) => {
    // Handle network errors or HTTP error responses
    if (error.response) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = error.response.data as BaseResponse<any>;

      // If response has BaseResponse structure, use it
      if (data && typeof data === "object" && "status" in data) {
        const apiError = new ApiError(
          data.status.statusCode,
          data.status.errorCode,
          data.status.desc,
          data.status.errors,
          error.response,
        );

        // Handle 401 Unauthorized
        if (data.status.statusCode === 401) {
          cookieUtils.removeToken();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }

        return Promise.reject(apiError);
      }

      // Fallback for non-BaseResponse errors
      const apiError = new ApiError(
        error.response.status,
        "UNKNOWN_ERROR",
        error.response.statusText || "An error occurred",
        {},
        error.response,
      );

      if (error.response.status === 401) {
        cookieUtils.removeToken();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      return Promise.reject(apiError);
    }

    // Network error or timeout
    const apiError = new ApiError(
      0,
      "NETWORK_ERROR",
      error.message || "Network error occurred",
      {},
    );

    return Promise.reject(apiError);
  },
);
