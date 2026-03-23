# Fixing Hydration Mismatch Issues

## What is Hydration Mismatch?

A hydration mismatch occurs when the HTML rendered by the server doesn't match the HTML rendered by React on the client. This is common with theme systems because:

1. **Server**: Renders without knowing user's theme preference
2. **Client**: Loads theme from localStorage and applies it
3. **Mismatch**: Server HTML ≠ Client HTML

## Symptoms

- Console warnings: `Warning: Text content did not match...` or `Warning: Prop 'className' did not match...`
- Console errors about hydration
- Flash of unstyled content (FOUC)
- Theme flickering on page load

## Solutions Implemented

### 1. `suppressHydrationWarning` on `<html>`

```tsx
<html suppressHydrationWarning>
```

This tells React to ignore hydration mismatches on the HTML element where the `dark` class is dynamically added.

### 2. Disable Transition on Change

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange  // Prevents flash during hydration
>
```

This prevents CSS transitions from running when the theme is first set, avoiding visual glitches.

### 3. Proper Class Structure

```tsx
// ✅ Good - classes that work with theme
<body className="min-h-screen bg-white dark:bg-gray-900">

// ❌ Bad - avoid deeply nested theme-dependent initial renders
```

### 4. Theme Toggle Mounting Check

The `ThemeToggle` component already handles this correctly:

```tsx
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) {
  return <div>...</div>; // Placeholder that matches server
}
```

## Additional Fixes (If Issues Persist)

### Option A: Use ThemeProvider's Script

For more complex cases, inject a blocking script:

```tsx
// In app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Option B: Avoid Theme Classes on Initial Render

Move theme-dependent styles down to child components:

```tsx
// layout.tsx - minimal styling
<body className="min-h-screen">
  <Providers>
    <ThemeWrapper>{children}</ThemeWrapper>
  </Providers>
</body>;

// theme-wrapper.tsx - client component with theme styles
("use client");
export function ThemeWrapper({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {children}
    </div>
  );
}
```

### Option C: CSS Variables Approach

Use CSS variables that don't cause hydration issues:

```css
/* globals.css */
:root {
  --background: white;
  --foreground: black;
}

:root.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

```tsx
// No dark: classes needed
<body className="min-h-screen">
```

## Testing for Hydration Issues

### 1. Check Browser Console

Open DevTools and look for warnings:

- `Text content did not match`
- `Prop 'className' did not match`
- `Hydration failed`

### 2. Enable Strict Mode

In `next.config.ts`:

```ts
const nextConfig = {
  reactStrictMode: true, // Helps catch hydration issues
};
```

### 3. Test in Production Build

Development mode can mask some issues:

```bash
pnpm build
pnpm start
```

### 4. Test with Different Themes

1. Clear localStorage
2. Reload page with light system theme
3. Reload page with dark system theme
4. Set localStorage theme manually
5. Check for any flashing or warnings

## Current Implementation Summary

✅ **Fixed:**

- `suppressHydrationWarning` on `<html>`
- `disableTransitionOnChange` in ThemeProvider
- Theme toggle with proper mounting check
- Minimal body classes

✅ **Working:**

- No hydration mismatch warnings
- Smooth theme transitions
- Persistent theme preference
- System theme detection

## Common Mistakes to Avoid

❌ **Don't do this:**

```tsx
// Conditionally render based on theme
{
  theme === "dark" && <DarkComponent />;
}
{
  theme === "light" && <LightComponent />;
}
```

✅ **Do this instead:**

```tsx
// Use CSS classes
<Component className="block dark:hidden" />
<Component className="hidden dark:block" />
```

❌ **Don't do this:**

```tsx
// Use theme in component before mounting
const { theme } = useTheme();
return <div>{theme}</div>; // Causes hydration mismatch!
```

✅ **Do this instead:**

```tsx
const { theme } = useTheme();
const [mounted, setMounted] = useState(false);

useEffect(() => setMounted(true), []);
if (!mounted) return null;

return <div>{theme}</div>;
```

## Debugging Checklist

If you still see hydration mismatches:

- [ ] Check `suppressHydrationWarning` is on `<html>`
- [ ] Verify ThemeProvider has `disableTransitionOnChange`
- [ ] Ensure theme-dependent components check `mounted` state
- [ ] Look for any `useEffect` that modifies className
- [ ] Check for components that conditionally render based on theme
- [ ] Verify no server components are using `useTheme()`
- [ ] Clear browser cache and localStorage
- [ ] Test in incognito mode
- [ ] Check for browser extensions interfering

## References

- [Next.js Hydration Errors](https://nextjs.org/docs/messages/react-hydration-error)
- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [React Hydration](https://react.dev/reference/react-dom/client/hydrateRoot)
