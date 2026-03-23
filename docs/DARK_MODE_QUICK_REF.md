# Dark Mode Quick Reference

## 🎯 Quick Start

### 1. Theme Toggle (Already Done!)

The theme toggle is available in the login page (top right). Click to switch between light and dark modes.

### 2. Adding Dark Mode to Your Components

Use Tailwind's `dark:` variant:

```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Your content</div>
```

## 📋 Common Patterns

### Text Colors

```tsx
// Primary text
<p className="text-gray-900 dark:text-gray-100">

// Secondary text
<p className="text-gray-600 dark:text-gray-400">

// Muted text
<p className="text-gray-500 dark:text-gray-500">
```

### Backgrounds

```tsx
// Page background
<div className="bg-gray-50 dark:bg-gray-900">

// Card/Surface
<div className="bg-white dark:bg-gray-800">

// Hover states
<div className="hover:bg-gray-100 dark:hover:bg-gray-800">
```

### Borders

```tsx
// Standard border
<div className="border-gray-300 dark:border-gray-700">

// Divider
<hr className="border-gray-200 dark:border-gray-800" />
```

### Forms

```tsx
// Input (already handled by Input component)
<Input ... />  // ✅ Auto dark mode support

// Custom input
<input className="
  bg-white dark:bg-gray-800
  text-gray-900 dark:text-gray-100
  border-gray-300 dark:border-gray-600
" />
```

### Buttons

```tsx
// All Button variants support dark mode
<Button variant="primary">Primary</Button>    // ✅
<Button variant="secondary">Secondary</Button> // ✅
<Button variant="danger">Danger</Button>       // ✅
<Button variant="ghost">Ghost</Button>         // ✅
```

## 🔧 Using Theme in Code

```tsx
"use client";

import { useTheme } from "next-themes";

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Change theme programmatically
  setTheme("dark");
  setTheme("light");
  setTheme("system");

  // Get current theme
  console.log(theme); // "dark" | "light" | "system"
  console.log(resolvedTheme); // "dark" | "light" (resolved from system)
}
```

## ✅ Component Checklist

When creating a new component, check these elements for dark mode:

- [ ] Background colors (`bg-*`)
- [ ] Text colors (`text-*`)
- [ ] Border colors (`border-*`)
- [ ] Hover states (`hover:*`)
- [ ] Focus states (`focus:*`)
- [ ] Shadow colors (`shadow-*`)
- [ ] Icons/SVGs (ensure visible in both themes)
- [ ] Images (consider providing dark variants)

## 🎨 Color Cheat Sheet

| Element | Light               | Dark                |
| ------- | ------------------- | ------------------- |
| Page BG | `bg-gray-50`        | `bg-gray-900`       |
| Surface | `bg-white`          | `bg-gray-800`       |
| Text 1° | `text-gray-900`     | `text-gray-100`     |
| Text 2° | `text-gray-600`     | `text-gray-400`     |
| Border  | `border-gray-300`   | `border-gray-700`   |
| Hover   | `hover:bg-gray-100` | `hover:bg-gray-800` |

## 📖 More Information

See [DARK_MODE.md](./DARK_MODE.md) for complete documentation.
