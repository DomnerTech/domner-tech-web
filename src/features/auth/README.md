# Authentication Feature

## Overview

This authentication feature provides a complete login system with form validation, API integration, state management, and **cookie-based token storage** for enhanced security.

## Request Body Format

```json
{
  "username": "kak_dev",
  "pwd": "supperadmin"
}
```

## Features

- ✅ Form validation with Zod
- ✅ React Hook Form integration
- ✅ React Query for API calls
- ✅ Zustand for state management
- ✅ **Cookie-based token storage** (secure, HttpOnly ready)
- ✅ Reusable UI components (Input, Button)
- ✅ Automatic token management
- ✅ Protected routes support
- ✅ Error handling

## File Structure

```
features/auth/
├── components/
│   └── login-form.tsx       # Login form component
├── hooks/
│   └── use-auth.ts          # Authentication hooks
├── schemas/
│   └── login.schema.ts      # Zod validation schemas
├── services/
│   └── auth.service.ts      # API service functions
├── store/
│   └── auth.store.ts        # Zustand auth state
└── types.ts                 # TypeScript types
```

## Usage

### Login Page

The login page is located at `/login` ([src/app/(auth)/login/page.tsx](<src/app/(auth)/login/page.tsx>))

### Using the Auth Store

```tsx
import { useAuthStore } from "@/features/auth/store/auth.store";

function Component() {
  const { user, isAuthenticated, logout } = useAuthStore();

  // Access user data
  console.log(user);

  // Check auth status
  if (isAuthenticated) {
    // User is logged in
  }

  // Logout
  logout();
}
```

### Using the Login Hook

```tsx
import { useLogin } from "@/features/auth/hooks/use-auth";

function LoginComponent() {
  const { mutate: login, isPending, error } = useLogin();

  const handleLogin = () => {
    login({
      username: "kak_dev",
      pwd: "supperadmin",
    });
  };
}
```

## Configuration

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Update the API URL:
   ```
   NEXT_PUBLIC_API_URL=http://your-api-url.com/api
   ```

## API Endpoint

The login request is sent to:

- Endpoint: `POST /auth/login`
- Base URL: From `NEXT_PUBLIC_API_URL` environment variable

## Protected Routes

To protect a route, check the auth state:

```tsx
"use client";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <div>Protected Content</div>;
}
```

## Token Management

- Tokens are automatically stored in **cookies** (more secure than localStorage)
- Cookie settings:
  - Expires in 7 days
  - SameSite: Strict
  - Secure flag in production
- Cookies are **automatically sent with every request** (no manual header injection needed)
- HTTP client configured with `withCredentials: true`
- On 401 errors, the user is automatically redirected to login

### Server Requirements

Your backend API must:

1. Set CORS headers to allow credentials:
   ```
   Access-Control-Allow-Credentials: true
   Access-Control-Allow-Origin: <your-frontend-url> (not *)
   ```
2. Read the token from cookies (not Authorization header)
3. Set the token as a cookie in the login response (optional, or use client-side setting)

## Reusable UI Components

### Input Component

```tsx
import { Input } from "@/components/ui";

<Input
  id="email"
  type="email"
  label="Email"
  placeholder="Enter your email"
  error={errors.email?.message}
  helperText="We'll never share your email"
/>;
```

### Button Component

```tsx
import { Button } from "@/components/ui";

<Button
  variant="primary" // primary | secondary | danger | ghost
  size="md" // sm | md | lg
  isLoading={isPending}
>
  Submit
</Button>;
```
