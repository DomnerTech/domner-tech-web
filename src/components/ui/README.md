# UI Components

Reusable UI components for the application with **built-in dark mode support**.

## Components

### Input

A flexible input component with built-in label, error, and helper text support.

**Props:**

- `label` - Optional label text
- `error` - Error message to display
- `helperText` - Helper text shown below input
- All standard HTML input attributes

**Usage:**

```tsx
import { Input } from "@/components/ui";

// Basic usage
<Input
  id="username"
  type="text"
  placeholder="Enter username"
/>

// With label and error
<Input
  id="email"
  type="email"
  label="Email Address"
  error={errors.email?.message}
  placeholder="you@example.com"
/>

// With React Hook Form
const { register, formState: { errors } } = useForm();

<Input
  id="password"
  type="password"
  label="Password"
  error={errors.password?.message}
  {...register("password")}
/>

// With helper text
<Input
  id="phone"
  type="tel"
  label="Phone Number"
  helperText="Format: (123) 456-7890"
  placeholder="(___) ___-____"
/>
```

### Button

A versatile button component with multiple variants, sizes, and loading states.

**Props:**

- `variant` - `"primary"` | `"secondary"` | `"danger"` | `"ghost"` (default: `"primary"`)
- `size` - `"sm"` | `"md"` | `"lg"` (default: `"md"`)
- `isLoading` - Shows loading spinner when true
- All standard HTML button attributes

**Usage:**

```tsx
import { Button } from "@/components/ui";

// Primary button (default)
<Button onClick={handleSubmit}>
  Submit
</Button>

// Different variants
<Button variant="secondary">
  Cancel
</Button>

<Button variant="danger">
  Delete
</Button>

<Button variant="ghost">
  Skip
</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Loading state
<Button isLoading={isPending}>
  Saving...
</Button>

// Full width
<Button className="w-full">
  Sign In
</Button>

// Disabled
<Button disabled>
  Disabled
</Button>
```

### ThemeToggle

A theme switcher component that toggles between light and dark mode.

**Features:**

- 🌓 Toggles between light and dark themes
- 🎨 Animated icons (sun/moon)
- ♿ Accessible with ARIA labels
- 💾 Persists theme preference
- ⚡ No hydration issues

**Usage:**

```tsx
import { ThemeToggle } from "@/components/ui";

// Basic usage
<ThemeToggle />

// In a navigation bar
<nav className="flex items-center justify-between">
  <Logo />
  <div className="flex items-center gap-4">
    <NavLinks />
    <ThemeToggle />
  </div>
</nav>

// Positioned absolutely
<div className="relative">
  <div className="absolute top-4 right-4">
    <ThemeToggle />
  </div>
</div>
```

**Programmatic Control:**

```tsx
"use client";

import { useTheme } from "next-themes";

function CustomThemeControl() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <button onClick={() => setTheme("light")}>Light</button>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <button onClick={() => setTheme("system")}>System</button>
      <p>Current: {theme}</p>
    </div>
  );
}
```

**See also:** [Dark Mode Documentation](../../docs/DARK_MODE.md)

## Examples

### Login Form Example

```tsx
import { Input, Button } from "@/components/ui";
import { useForm } from "react-hook-form";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    // Handle login
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="username"
        type="text"
        label="Username"
        placeholder="Enter username"
        error={errors.username?.message}
        {...register("username")}
      />

      <Input
        id="password"
        type="password"
        label="Password"
        placeholder="Enter password"
        error={errors.password?.message}
        {...register("password")}
      />

      <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
        Sign In
      </Button>
    </form>
  );
}
```

### Contact Form Example

```tsx
import { Input, Button } from "@/components/ui";

function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form className="space-y-4">
      <Input
        id="name"
        type="text"
        label="Name"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        id="email"
        type="email"
        label="Email"
        placeholder="john@example.com"
        helperText="We'll never share your email"
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="flex gap-2">
        <Button type="submit" variant="primary">
          Submit
        </Button>
        <Button type="button" variant="ghost">
          Cancel
        </Button>
      </div>
    </form>
  );
}
```

## Styling

All components use Tailwind CSS and can be customized via the `className` prop. The components are designed to work with your existing design system and can be easily extended.

## Accessibility

- Inputs have proper ARIA attributes for errors and helper text
- Labels are properly associated with inputs
- Buttons show loading state to screen readers
- All interactive elements are keyboard accessible
