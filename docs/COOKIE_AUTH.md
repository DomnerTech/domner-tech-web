# Cookie Authentication Setup

## Current Implementation

Cookies are automatically sent with every HTTP request thanks to `withCredentials: true` in the axios configuration.

### How it Works

1. **Login**: User submits credentials → Server returns token → Token stored in cookie
2. **Subsequent Requests**: Browser automatically includes cookie → Server validates token from cookie
3. **Logout**: Cookie is removed from client

### Cookie Configuration

```javascript
// src/lib/cookies.ts
{
  expires: 7,              // 7 days
  sameSite: "strict",      // CSRF protection
  secure: production,      // HTTPS only in production
}
```

## Server-Side Requirements

Your backend API **must** support cookies:

### 1. CORS Configuration

```javascript
// Example Express.js
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true, // Allow cookies
  }),
);
```

### 2. Read Token from Cookie

```javascript
// Example: Read token from cookie in middleware
app.use((req, res, next) => {
  const token = req.cookies.auth_token;
  if (token) {
    // Verify token
    req.user = verifyToken(token);
  }
  next();
});
```

### 3. Response Headers

```
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: http://localhost:3000 (exact origin, NOT *)
```

## Upgrade to HttpOnly Cookies (Recommended)

For maximum security, have your server set HttpOnly cookies:

### Backend Changes

```javascript
// Login endpoint
app.post("/auth/login", (req, res) => {
  const { username, pwd } = req.body;

  // Validate credentials...
  const token = generateToken(user);

  // Set HttpOnly cookie (can't be accessed by JavaScript)
  res.cookie("auth_token", token, {
    httpOnly: true, // Prevents XSS attacks
    secure: true, // HTTPS only
    sameSite: "strict", // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({ user }); // Don't send token in response body
});
```

### Frontend Changes (for HttpOnly)

```typescript
// src/features/auth/store/auth.store.ts
setAuth: (user: User) => {  // No token parameter needed
  // Token is in HttpOnly cookie, managed by browser
  set({ user, isAuthenticated: true });
},
```

## Security Benefits

| Feature          | localStorage | Client Cookie      | HttpOnly Cookie    |
| ---------------- | ------------ | ------------------ | ------------------ |
| XSS Protection   | ❌           | ❌                 | ✅                 |
| CSRF Protection  | ✅           | ⚠️ (with SameSite) | ⚠️ (with SameSite) |
| Accessible to JS | ✅           | ✅                 | ❌                 |
| Auto-sent        | ❌           | ✅                 | ✅                 |
| Recommended      | ❌           | ⚠️                 | ✅                 |

**Current implementation:** Client Cookie (Good)
**Recommended:** HttpOnly Cookie (Best)

## Testing

```bash
# Check if cookies are sent
curl -X GET http://localhost:3000/api/protected \
  -H "Cookie: auth_token=your-token" \
  -v
```

Look for `Set-Cookie` in response headers after login.
