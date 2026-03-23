# API Response Handling

This document explains how the application handles API responses from the backend.

## Backend Response Structure

The backend uses a standardized response format:

```csharp
public class BaseResponse<T>
{
    public ResponseStatus Status { get; set; }
    public bool IsSuccess => Status.StatusCode is >= 200 and < 300;
    public T Data { get; set; }
}

public class ResponseStatus
{
    public string Desc { get; set; }
    public string ErrorCode { get; set; }
    public int StatusCode { get; set; }
    public Dictionary<string, string[]> Errors { get; set; }
}
```

## Frontend Types

Matching TypeScript types are defined in [src/types/api.ts](../src/types/api.ts):

```typescript
export interface BaseResponse<T = void> {
  status: ResponseStatus;
  isSuccess: boolean;
  data: T;
}

export interface ResponseStatus {
  desc: string;
  errorCode: string;
  statusCode: number;
  errors: Record<string, string[]>;
}
```

## ApiError Class

Custom error class that provides utility methods:

```typescript
export class ApiError extends Error {
  statusCode: number;
  errorCode: string;
  desc: string;
  errors: Record<string, string[]>;

  // Get first error message
  getFirstError(): string;

  // Get all error messages as flat array
  getAllErrors(): string[];

  // Get errors for a specific field
  getFieldErrors(field: string): string[];

  // Check if it's a validation error (400 with validation errors)
  isValidationError(): boolean;
}
```

## How It Works

### 1. Successful Response

```json
{
  "status": {
    "desc": "Login successful",
    "errorCode": "OK",
    "statusCode": 200,
    "errors": {}
  },
  "isSuccess": true,
  "data": {
    "token": "abc123",
    "user": {
      "id": "1",
      "username": "john_doe"
    }
  }
}
```

The HTTP interceptor checks `isSuccess` and returns `response.data.data` to your service.

### 2. Error Response

```json
{
  "status": {
    "desc": "Validation failed",
    "errorCode": "VALIDATION_ERROR",
    "statusCode": 400,
    "errors": {
      "username": ["Username is required"],
      "pwd": ["Password must be at least 8 characters"]
    }
  },
  "isSuccess": false,
  "data": null
}
```

The interceptor throws an `ApiError` with all error details.

## Usage Examples

### Creating a Service

```typescript
import { http } from "@/lib/http";
import type { BaseResponse } from "@/types/api";

interface UserData {
  id: string;
  name: string;
}

export const userService = {
  getUser: async (id: string): Promise<UserData> => {
    const response = await http.get<BaseResponse<UserData>>(`/users/${id}`);
    return response.data.data; // Extract data from BaseResponse
  },

  createUser: async (userData: Partial<UserData>): Promise<UserData> => {
    const response = await http.post<BaseResponse<UserData>>("/users", userData);
    return response.data.data;
  },
};
```

### Handling Errors in Components

```typescript
import { ApiError } from "@/types/api";

function MyComponent() {
  const { mutate, error } = useMutation({
    mutationFn: userService.createUser,
  });

  // Type-safe error handling
  const apiError = error instanceof ApiError ? error : null;

  return (
    <>
      {/* Show general error */}
      {apiError && <p>{apiError.desc}</p>}

      {/* Show field-specific errors */}
      {apiError?.getFieldErrors("username").map(err => (
        <p key={err}>{err}</p>
      ))}

      {/* Show all validation errors */}
      {apiError?.isValidationError() && (
        <ul>
          {apiError.getAllErrors().map(err => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}
    </>
  );
}
```

### With React Hook Form

```typescript
import { Input } from "@/components/ui";
import { ApiError } from "@/types/api";

function MyForm() {
  const { register, formState: { errors } } = useForm();
  const { mutate, error } = useMutation(...);

  const apiError = error instanceof ApiError ? error : null;

  return (
    <Input
      label="Username"
      error={
        // Show client-side validation error OR server-side error
        errors.username?.message ||
        apiError?.getFieldErrors("username")[0]
      }
      {...register("username")}
    />
  );
}
```

## Error Types by Status Code

| Status Code | Error Type       | Example                                  |
| ----------- | ---------------- | ---------------------------------------- |
| 400         | Validation Error | Invalid input, missing required fields   |
| 401         | Unauthorized     | Invalid credentials, expired token       |
| 403         | Forbidden        | Insufficient permissions                 |
| 404         | Not Found        | Resource doesn't exist                   |
| 409         | Conflict         | Duplicate entry, concurrent modification |
| 500         | Server Error     | Internal server error                    |

## Automatic Error Handling

The HTTP interceptor automatically:

1. ✅ Checks `isSuccess` flag
2. ✅ Throws `ApiError` for failed responses
3. ✅ Redirects to `/login` on 401 errors
4. ✅ Clears auth cookies on 401
5. ✅ Handles network errors gracefully

## Best Practices

### 1. Always Type Your Responses

```typescript
// ✅ Good
const response = await http.get<BaseResponse<UserData>>("/users/1");
return response.data.data;

// ❌ Bad
const response = await http.get("/users/1");
return response.data; // Lost type safety
```

### 2. Handle ApiError Properly

```typescript
// ✅ Good
const apiError = error instanceof ApiError ? error : null;
if (apiError) {
  console.log(apiError.desc);
  console.log(apiError.getFieldErrors("email"));
}

// ❌ Bad - might not be ApiError
console.log(error.desc); // Type error
```

### 3. Show Field-Specific Errors

```typescript
// ✅ Good - show error next to the field
<Input
  error={errors.email?.message || apiError?.getFieldErrors("email")[0]}
/>

// ⚠️ Okay - show all errors in one place
<div>
  {apiError?.getAllErrors().map(err => <p>{err}</p>)}
</div>
```

### 4. Provide Fallback Messages

```typescript
// ✅ Good
{apiError && (
  <p>{apiError.desc || "An unexpected error occurred"}</p>
)}

// ❌ Bad - might show empty message
{error && <p>{error.message}</p>}
```

## Testing Error Responses

### Mock Successful Response

```typescript
const mockSuccess: BaseResponse<UserData> = {
  status: {
    desc: "Success",
    errorCode: "OK",
    statusCode: 200,
    errors: {},
  },
  isSuccess: true,
  data: { id: "1", name: "John" },
};
```

### Mock Error Response

```typescript
const mockError: BaseResponse<null> = {
  status: {
    desc: "User not found",
    errorCode: "NOT_FOUND",
    statusCode: 404,
    errors: {},
  },
  isSuccess: false,
  data: null,
};
```

### Mock Validation Error

```typescript
const mockValidationError: BaseResponse<null> = {
  status: {
    desc: "Validation failed",
    errorCode: "VALIDATION_ERROR",
    statusCode: 400,
    errors: {
      username: ["Username is required", "Username must be unique"],
      email: ["Invalid email format"],
    },
  },
  isSuccess: false,
  data: null,
};
```

## Troubleshooting

### Error not showing in UI

Check if you're checking for `ApiError` instance:

```typescript
const apiError = error instanceof ApiError ? error : null;
```

### Type errors with BaseResponse

Make sure you're using the generic type:

```typescript
// ✅ Correct
BaseResponse<UserData>;

// ❌ Wrong
BaseResponse; // Missing type parameter
```

### Cookies not being sent

Ensure `withCredentials: true` is set in axios config (already configured in [src/lib/http.ts](../src/lib/http.ts)).
