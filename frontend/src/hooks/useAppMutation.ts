// src/hooks/useAppMutation.ts
// Wrapper around react-query's useMutation with built-in error handling

import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { toAppError, AppError } from '@/lib/errors';
import { showError } from '@/lib/notify';

/**
 * Options for useAppMutation
 * Excludes onError since it's handled automatically
 */
type AppMutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, AppError, TVariables>,
  'onError'
> & {
  /**
   * Optional custom error handler
   * If provided, automatic error toast will be skipped
   */
  onError?: (error: AppError, variables: TVariables) => void;
  /**
   * Whether to show automatic error toast
   * Default: true
   */
  showErrorToast?: boolean;
};

/**
 * Enhanced useMutation with automatic error handling
 *
 * Features:
 * - Automatically converts all errors to AppError
 * - Shows error toast by default (can be disabled)
 * - Allows custom error handler
 * - Type-safe error handling
 *
 * @example
 * ```tsx
 * const loginMutation = useAppMutation({
 *   mutationFn: (credentials) => authService.login(credentials),
 *   onSuccess: (data) => {
 *     // Handle success
 *     navigate('/dashboard');
 *   },
 * });
 * ```
 */
export function useAppMutation<TData = unknown, TVariables = void>(
  options: AppMutationOptions<TData, TVariables>
): UseMutationResult<TData, AppError, TVariables> {
  const { onError, showErrorToast = true, ...restOptions } = options;

  return useMutation<TData, AppError, TVariables>({
    ...restOptions,
    onError: (error, variables, context) => {
      // Convert to AppError if not already
      const appError = toAppError(error);

      // Show automatic error toast if enabled
      if (showErrorToast) {
        showError(appError);
      }

      // Call custom error handler if provided
      if (onError) {
        onError(appError, variables);
      }
    },
  });
}

/**
 * Hook variant that doesn't show automatic error toast
 * Useful when you want to handle errors manually
 */
export function useAppMutationSilent<TData = unknown, TVariables = void>(
  options: Omit<AppMutationOptions<TData, TVariables>, 'showErrorToast'>
): UseMutationResult<TData, AppError, TVariables> {
  return useAppMutation({
    ...options,
    showErrorToast: false,
  });
}
