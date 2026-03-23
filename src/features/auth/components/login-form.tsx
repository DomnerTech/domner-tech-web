"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input, Button } from "@/components/ui";
import { ApiError } from "@/types/api";
import { loginSchema, type LoginFormData } from "../schemas/login.schema";
import { useLogin } from "../hooks/use-auth";

export function LoginForm() {
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // Validate on every change (real-time)
    reValidateMode: "onChange", // Re-validate on change after first submit
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  // Get API error if it's an ApiError instance
  const apiError = error instanceof ApiError ? error : null;

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          id="username"
          type="text"
          label="Username"
          placeholder="Enter your username"
          error={errors.username?.message || apiError?.getFieldErrors("username")[0]}
          disabled={isPending}
          {...register("username")}
        />

        <Input
          id="pwd"
          type="password"
          label="Password"
          placeholder="Enter your password"
          error={errors.pwd?.message || apiError?.getFieldErrors("pwd")[0]}
          disabled={isPending}
          {...register("pwd")}
        />

        {/* General error message */}
        {apiError && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <div className="flex">
              <div className="shrink-0">
                <svg
                  className="h-5 w-5 text-red-400 dark:text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                  {apiError.desc || "Login failed"}
                </h3>
                {apiError.isValidationError() && apiError.getAllErrors().length > 0 && (
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <ul className="list-disc pl-5 space-y-1">
                      {apiError.getAllErrors().map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <Button type="submit" variant="primary" size="md" isLoading={isPending} className="w-full">
          Sign in
        </Button>
      </form>
    </div>
  );
}
