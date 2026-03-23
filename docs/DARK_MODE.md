# Dark Mode Setup

This application supports light and dark themes using [next-themes](https://github.com/pacocoursey/next-themes).

## Features

- 🌓 Automatic system theme detection
- 💾 Persistent theme preference (localStorage)
- ⚡ No flash on page load
- 🎨 Comprehensive dark mode support across all components
- 🔄 Easy toggle between themes

## How It Works

### Theme Provider

The `ThemeProvider` is configured in [src/components/providers.tsx](../src/components/providers.tsx):

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

**Configuration:**

- `attribute="class"` - Uses Tailwind's `dark:` class variant
- `defaultTheme="system"` - Respects user's system preference
- `enableSystem` - Enables system theme detection

### Root Layout

The `<html>` element has `suppressHydrationWarning` to prevent hydration mismatches:

```tsx
<html suppressHydrationWarning>
  <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
```

## Using the Theme Toggle

### Import and Use

```tsx
import { ThemeToggle } from "@/components/ui";

function MyComponent() {
  return (
    <div>
      <ThemeToggle />
    </div>
  );
}
```

### Programmatic Theme Control

```tsx
"use client";

import { useTheme } from "next-themes";

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <button onClick={() => setTheme("light")}>Light</button>
      <button onClick={() => setTheme("system")}>System</button>
    </div>
  );
}
```

## Adding Dark Mode to Components

### Using Tailwind Dark Variant

```tsx
// Text colors
<p className="text-gray-900 dark:text-gray-100">Text</p>

// Background colors
<div className="bg-white dark:bg-gray-900">Content</div>

// Borders
<div className="border-gray-300 dark:border-gray-700">Content</div>

// Hover states
<button className="hover:bg-gray-100 dark:hover:bg-gray-800">
  Button
</button>
```

### Complete Component Example

```tsx
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
      rounded-lg border p-6
      bg-white dark:bg-gray-800
      border-gray-200 dark:border-gray-700
      text-gray-900 dark:text-gray-100
      shadow-sm hover:shadow-md
      transition-shadow
    "
    >
      {children}
    </div>
  );
}
```

## Built-in Dark Mode Support

All UI components have built-in dark mode support:

### Input Component

```tsx
<Input
  label="Email"
  placeholder="Enter email"
  // Automatically supports dark mode
/>
```

Dark mode features:

- Dark background (`dark:bg-gray-800`)
- Light text (`dark:text-gray-100`)
- Dark borders (`dark:border-gray-600`)
- Dark placeholders (`dark:placeholder:text-gray-500`)

### Button Component

All button variants support dark mode:

```tsx
<Button variant="primary">Primary</Button>    {/* Blue in both themes */}
<Button variant="secondary">Secondary</Button>  {/* Gray, adapts to theme */}
<Button variant="danger">Danger</Button>      {/* Red in both themes */}
<Button variant="ghost">Ghost</Button>        {/* Transparent, adapts to theme */}
```

## Color Guidelines

### Recommended Dark Mode Colors

| Element          | Light Mode          | Dark Mode           |
| ---------------- | ------------------- | ------------------- |
| Background       | `bg-white`          | `bg-gray-900`       |
| Card/Surface     | `bg-gray-50`        | `bg-gray-800`       |
| Text (Primary)   | `text-gray-900`     | `text-gray-100`     |
| Text (Secondary) | `text-gray-600`     | `text-gray-400`     |
| Border           | `border-gray-300`   | `border-gray-700`   |
| Hover (Light)    | `hover:bg-gray-100` | `hover:bg-gray-800` |
| Input Background | `bg-white`          | `bg-gray-800`       |
| Disabled         | `opacity-50`        | `opacity-50`        |

### Accessibility

Maintain proper contrast ratios:

- Light mode: Dark text on light backgrounds
- Dark mode: Light text on dark backgrounds
- Use Tailwind's default color scales (they're designed for accessibility)

## Testing Both Themes

### Manual Testing

1. Click the theme toggle button
2. Check all pages and components
3. Verify colors are readable in both themes

### Browser DevTools

Force a theme in Chrome DevTools:

1. Open DevTools (F12)
2. Press `Ctrl+Shift+P` (Cmd+Shift+P on Mac)
3. Type "Rendering"
4. Select "Emulate CSS media feature prefers-color-scheme"

### Testing Code

```tsx
// Force dark mode for testing
<ThemeProvider forcedTheme="dark">{children}</ThemeProvider>
```

## Common Patterns

### Conditional Rendering Based on Theme

```tsx
"use client";

import { useTheme } from "next-themes";

function Logo() {
  const { resolvedTheme } = useTheme();

  if (resolvedTheme === "dark") {
    return <img src="/logo-dark.svg" alt="Logo" />;
  }

  return <img src="/logo-light.svg" alt="Logo" />;
}
```

### Different Images for Themes

```tsx
<img
  src="/hero-light.jpg"
  className="block dark:hidden"
  alt="Hero"
/>
<img
  src="/hero-dark.jpg"
  className="hidden dark:block"
  alt="Hero"
/>
```

### Theme-Aware Custom Colors

```tsx
// Define in tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3b82f6',
          dark: '#60a5fa',
        },
      },
    },
  },
};

// Usage
<div className="bg-[theme(colors.primary.light)] dark:bg-[theme(colors.primary.dark)]">
```

## Troubleshooting

### Flash of Unstyled Content (FOUC)

If you see a flash when the page loads:

1. Ensure `suppressHydrationWarning` is on `<html>`:

   ```tsx
   <html suppressHydrationWarning>
   ```

2. Check ThemeProvider is in a Client Component:

   ```tsx
   "use client";
   ```

3. The theme toggle uses a mounting check to prevent hydration issues

### Theme Not Persisting

The theme is automatically saved to localStorage as `theme`.

Check:

1. Browser localStorage is enabled
2. Key `theme` exists in localStorage
3. Value is "light", "dark", or "system"

### System Theme Not Working

Ensure `enableSystem` is true in ThemeProvider:

```tsx
<ThemeProvider enableSystem>
```

### CSS Not Applying

Check that Tailwind config includes dark mode:

```js
// tailwind.config.ts
module.exports = {
  darkMode: "class", // or 'media'
  // ...
};
```

## Best Practices

1. **Always test both themes** when adding new UI
2. **Use Tailwind's color scales** (gray-50 to gray-900)
3. **Add dark: variants** to all colored elements
4. **Consider ARIA** - theme doesn't affect screen readers
5. **Test contrast ratios** - use browser tools
6. **Avoid absolute colors** - use semantic color names
7. **Use CSS variables** for complex theme switching

## Resources

- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
