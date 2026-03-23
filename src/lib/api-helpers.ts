import type { BaseResponse } from "@/types/api";

/**
 * Helper function to extract data from BaseResponse
 * Use this in services to simplify response handling
 */
export function extractData<T>(response: { data: BaseResponse<T> }): T {
  return response.data.data;
}

/**
 * Mock BaseResponse for testing
 */
export function createMockResponse<T>(
  data: T,
  statusCode: number = 200,
  desc: string = "Success",
): BaseResponse<T> {
  return {
    status: {
      desc,
      errorCode: statusCode === 200 ? "OK" : "ERROR",
      statusCode,
      errors: {},
    },
    isSuccess: statusCode >= 200 && statusCode < 300,
    data,
  };
}

/**
 * Mock error response for testing
 */
export function createMockErrorResponse<T = null>(
  statusCode: number,
  desc: string,
  errorCode: string = "ERROR",
  errors: Record<string, string[]> = {},
): BaseResponse<T> {
  return {
    status: {
      desc,
      errorCode,
      statusCode,
      errors,
    },
    isSuccess: false,
    data: null as T,
  };
}

/**
 * Type guard to check if error is ApiError
 */
export function isApiError(error: unknown): error is import("@/types/api").ApiError {
  return error instanceof Error && error.name === "ApiError";
}

/**
 * Format API errors for display
 */
export function formatApiError(error: unknown): string {
  if (!isApiError(error)) {
    return error instanceof Error ? error.message : "An unknown error occurred";
  }

  if (error.isValidationError()) {
    const errors = error.getAllErrors();
    return errors.length > 0 ? errors.join(", ") : error.desc;
  }

  return error.desc || "An error occurred";
}
