// Base response types matching backend C# structure

export interface ResponseStatus {
  desc: string;
  errorCode: string;
  statusCode: number;
  errors: Record<string, string[]>;
}

export interface BaseResponse<T = void> {
  status: ResponseStatus;
  isSuccess: boolean;
  data: T;
}

// API Error class for better error handling
export class ApiError<T = void> extends Error {
  constructor(
    public statusCode: number,
    public errorCode: string,
    public desc: string,
    public errors: Record<string, string[]> = {},
    public response?: T,
  ) {
    super(desc || "An error occurred");
    this.name = "ApiError";
  }

  // Get first error message
  getFirstError(): string {
    const firstKey = Object.keys(this.errors)[0];
    return firstKey ? this.errors[firstKey][0] : this.desc;
  }

  // Get all error messages as flat array
  getAllErrors(): string[] {
    return Object.values(this.errors).flat();
  }

  // Get errors for a specific field
  getFieldErrors(field: string): string[] {
    return this.errors[field] || [];
  }

  // Check if it's a validation error
  isValidationError(): boolean {
    return this.statusCode === 400 && Object.keys(this.errors).length > 0;
  }
}
