# Backend Integration Quick Reference

## Response Structure

All backend responses follow this structure:

```typescript
{
  status: {
    desc: string,           // Human-readable message
    errorCode: string,      // Machine-readable code (e.g., "OK", "VALIDATION_ERROR")
    statusCode: number,     // HTTP status code (200, 400, 401, etc.)
    errors: {               // Field-specific validation errors
      [fieldName]: string[]
    }
  },
  isSuccess: boolean,       // true if statusCode 200-299
  data: T                   // Your actual data
}
```

## Creating a New Service

```typescript
// src/features/myfeature/services/myservice.ts
import { http } from "@/lib/http";
import type { BaseResponse } from "@/types/api";

interface MyData {
  id: string;
  name: string;
}

export const myService = {
  getData: async (id: string): Promise<MyData> => {
    const response = await http.get<BaseResponse<MyData>>(`/api/data/${id}`);
    return response.data.data; // Extract data from BaseResponse
  },

  createData: async (data: Partial<MyData>): Promise<MyData> => {
    const response = await http.post<BaseResponse<MyData>>("/api/data", data);
    return response.data.data;
  },
};
```

## Using in React Query

```typescript
import { useMutation, useQuery } from "@tanstack/react-query";
import { myService } from "./services/myservice";

// Query
const { data, isLoading, error } = useQuery({
  queryKey: ["myData", id],
  queryFn: () => myService.getData(id),
});

// Mutation
const { mutate, isPending, error } = useMutation({
  mutationFn: myService.createData,
  onSuccess: (data) => {
    // data is already extracted from BaseResponse
    console.log(data.id, data.name);
  },
});
```

## Error Handling in Components

```typescript
import { ApiError } from "@/types/api";

function MyComponent() {
  const { error } = useMutation(...);

  // Type-safe error handling
  const apiError = error instanceof ApiError ? error : null;

  return (
    <>
      {/* Show general error description */}
      {apiError && (
        <div className="error">
          {apiError.desc}
        </div>
      )}

      {/* Show field-specific error in Input */}
      <Input
        label="Email"
        error={apiError?.getFieldErrors("email")[0]}
      />

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

## Common Patterns

### Pattern 1: Single Field Form

```typescript
const apiError = error instanceof ApiError ? error : null;

<Input
  label="Username"
  error={
    formErrors.username?.message ||  // Client validation
    apiError?.getFieldErrors("username")[0]  // Server validation
  }
  {...register("username")}
/>
```

### Pattern 2: Multi-Field Form

```typescript
const apiError = error instanceof ApiError ? error : null;

<form>
  <Input
    label="Email"
    error={errors.email?.message || apiError?.getFieldErrors("email")[0]}
    {...register("email")}
  />

  <Input
    label="Password"
    error={errors.password?.message || apiError?.getFieldErrors("password")[0]}
    {...register("password")}
  />

  {/* Show general error at the bottom */}
  {apiError && !apiError.isValidationError() && (
    <div className="error">{apiError.desc}</div>
  )}
</form>
```

### Pattern 3: List/Table with Error Toast

```typescript
const { mutate } = useMutation({
  mutationFn: myService.deleteItem,
  onError: (error) => {
    if (error instanceof ApiError) {
      toast.error(error.desc);
    }
  },
});
```

## Helper Functions

```typescript
import { isApiError, formatApiError } from "@/lib/api-helpers";

// Check if error is ApiError
if (isApiError(error)) {
  console.log(error.statusCode);
}

// Format error for display
const message = formatApiError(error);
```

## Backend Requirements Checklist

- [ ] All responses use `BaseResponse<T>` structure
- [ ] `isSuccess` correctly reflects status code (200-299)
- [ ] Validation errors in `status.errors` dictionary
- [ ] CORS configured with `credentials: true`
- [ ] Backend reads auth token from cookies
- [ ] Error descriptions are user-friendly

## Example Backend Response Examples

### Success

```json
POST /api/auth/login
{
  "status": {
    "desc": "Login successful",
    "errorCode": "OK",
    "statusCode": 200,
    "errors": {}
  },
  "isSuccess": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "123",
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
}
```

### Validation Error

```json
POST /api/users
{
  "status": {
    "desc": "Validation failed",
    "errorCode": "VALIDATION_ERROR",
    "statusCode": 400,
    "errors": {
      "email": ["Email is required", "Email must be valid"],
      "password": ["Password must be at least 8 characters"]
    }
  },
  "isSuccess": false,
  "data": null
}
```

### Unauthorized

```json
GET /api/protected-resource
{
  "status": {
    "desc": "Unauthorized access",
    "errorCode": "UNAUTHORIZED",
    "statusCode": 401,
    "errors": {}
  },
  "isSuccess": false,
  "data": null
}
```

### Not Found

```json
GET /api/users/999
{
  "status": {
    "desc": "User not found",
    "errorCode": "NOT_FOUND",
    "statusCode": 404,
    "errors": {}
  },
  "isSuccess": false,
  "data": null
}
```

## Troubleshooting

### "Cannot read property 'data' of undefined"

Make sure you're extracting data correctly:

```typescript
// ✅ Correct
return response.data.data;

// ❌ Wrong
return response.data;
```

### Validation errors not showing

Check if you're using ApiError:

```typescript
const apiError = error instanceof ApiError ? error : null;
```

### 401 redirecting but cookie still exists

The interceptor automatically clears cookies on 401. Check browser DevTools > Application > Cookies.
