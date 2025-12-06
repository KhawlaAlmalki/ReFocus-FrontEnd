// src/lib/notify.ts
// Centralized notification system using sonner

import { toast } from 'sonner';
import { AppError } from './errors';

/**
 * Get a friendly title based on error type
 */
function getErrorTitle(type: AppError['type']): string {
  switch (type) {
    case 'network':
      return 'Connection Error';
    case 'server':
      return 'Server Error';
    case 'validation':
      return 'Validation Error';
    case 'auth':
      return 'Authentication Failed';
    default:
      return 'Error';
  }
}

/**
 * Display an error toast notification
 */
export function showError(error: AppError): void {
  const title = getErrorTitle(error.type);

  // If we have validation errors with multiple fields, show them as a list
  if (error.details && typeof error.details === 'object') {
    const errors = Object.entries(error.details).map(([field, msgs]) => {
      const messages = Array.isArray(msgs) ? msgs : [msgs];
      return `${field}: ${messages.join(', ')}`;
    });

    if (errors.length > 1) {
      toast.error(title, {
        description: (
          <div>
            <p className="mb-2">{error.message}</p>
            <ul className="list-disc list-inside text-sm">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        ),
        duration: 5000,
      });
      return;
    }
  }

  // Simple error toast
  toast.error(title, {
    description: error.message,
    duration: 4000,
  });
}

/**
 * Display a success toast notification
 */
export function showSuccess(message: string, description?: string): void {
  toast.success(message, {
    description,
    duration: 3000,
  });
}

/**
 * Display an info toast notification
 */
export function showInfo(message: string, description?: string): void {
  toast.info(message, {
    description,
    duration: 3000,
  });
}

/**
 * Display a warning toast notification
 */
export function showWarning(message: string, description?: string): void {
  toast.warning(message, {
    description,
    duration: 3000,
  });
}

/**
 * Display a loading toast notification
 * Returns a function to dismiss the toast
 */
export function showLoading(message: string): () => void {
  const toastId = toast.loading(message);
  return () => toast.dismiss(toastId);
}

/**
 * Update a loading toast to success
 */
export function updateToSuccess(
  toastId: string | number,
  message: string,
  description?: string
): void {
  toast.success(message, {
    id: toastId,
    description,
    duration: 3000,
  });
}

/**
 * Update a loading toast to error
 */
export function updateToError(
  toastId: string | number,
  error: AppError
): void {
  toast.error(getErrorTitle(error.type), {
    id: toastId,
    description: error.message,
    duration: 4000,
  });
}
