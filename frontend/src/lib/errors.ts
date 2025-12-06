// src/lib/errors.ts
// Centralized error handling for the entire app

/**
 * Standardized error type for the entire application
 */
export interface AppError {
  type: 'network' | 'server' | 'validation' | 'auth' | 'unknown';
  status?: number;
  message: string;
  details?: any;
  raw?: unknown;
}

/**
 * Extract validation errors from backend response
 */
function extractValidationErrors(data: any): Record<string, string[]> | undefined {
  if (data?.errors && typeof data.errors === 'object') {
    return data.errors;
  }
  return undefined;
}

/**
 * Determine error type based on status code and message
 */
function determineErrorType(status?: number, message?: string): AppError['type'] {
  if (!status || status === 0) {
    return 'network';
  }

  if (status === 401 || status === 403) {
    return 'auth';
  }

  if (status >= 400 && status < 500) {
    if (message?.toLowerCase().includes('validation') ||
        message?.toLowerCase().includes('invalid') ||
        message?.toLowerCase().includes('required')) {
      return 'validation';
    }
    return 'validation'; // Client errors are often validation
  }

  if (status >= 500) {
    return 'server';
  }

  return 'unknown';
}

/**
 * Get user-friendly message based on error type
 */
function getFriendlyMessage(type: AppError['type'], originalMessage?: string): string {
  // If we have a specific backend message, use it
  if (originalMessage && originalMessage !== 'An error occurred') {
    return originalMessage;
  }

  // Otherwise, provide generic friendly messages
  switch (type) {
    case 'network':
      return 'Unable to connect to the server. Please check your internet connection.';
    case 'server':
      return 'Something went wrong on our end. Please try again later.';
    case 'auth':
      return 'Authentication failed. Please log in again.';
    case 'validation':
      return 'Please check your input and try again.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Convert any error into a standardized AppError
 * Handles axios errors, fetch errors, network failures, and backend responses
 */
export function toAppError(error: unknown): AppError {
  // Already an AppError
  if (error && typeof error === 'object' && 'type' in error && 'message' in error) {
    return error as AppError;
  }

  // Axios-like error (has response property)
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as any;
    const status = axiosError.response?.status;
    const data = axiosError.response?.data;
    const message = data?.message || axiosError.message;

    const type = determineErrorType(status, message);

    return {
      type,
      status,
      message: getFriendlyMessage(type, message),
      details: extractValidationErrors(data),
      raw: error,
    };
  }

  // Fetch API error (ApiError from api-client.ts)
  if (error && typeof error === 'object' && 'status' in error && 'message' in error) {
    const apiError = error as { status: number; message: string; errors?: any };
    const type = determineErrorType(apiError.status, apiError.message);

    return {
      type,
      status: apiError.status,
      message: getFriendlyMessage(type, apiError.message),
      details: apiError.errors,
      raw: error,
    };
  }

  // Network error (TypeError, fetch failed, etc.)
  if (error instanceof TypeError) {
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return {
        type: 'network',
        status: 0,
        message: 'Unable to connect to the server. Please check your internet connection.',
        raw: error,
      };
    }
  }

  // Generic Error object
  if (error instanceof Error) {
    return {
      type: 'unknown',
      message: error.message || 'An unexpected error occurred.',
      raw: error,
    };
  }

  // String error
  if (typeof error === 'string') {
    return {
      type: 'unknown',
      message: error,
      raw: error,
    };
  }

  // Unknown error type
  return {
    type: 'unknown',
    message: 'An unexpected error occurred.',
    raw: error,
  };
}

/**
 * Check if an error is a specific type
 */
export function isErrorType(error: unknown, type: AppError['type']): boolean {
  const appError = toAppError(error);
  return appError.type === type;
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  return isErrorType(error, 'auth');
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  return isErrorType(error, 'validation');
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  return isErrorType(error, 'network');
}

/**
 * Extract validation errors as a record for form fields
 */
export function getValidationErrors(error: unknown): Record<string, string> | null {
  const appError = toAppError(error);

  if (!appError.details) {
    return null;
  }

  // Convert array of errors to single string per field
  const result: Record<string, string> = {};

  for (const [field, errors] of Object.entries(appError.details)) {
    if (Array.isArray(errors)) {
      result[field] = errors[0] || 'Invalid value';
    } else if (typeof errors === 'string') {
      result[field] = errors;
    }
  }

  return Object.keys(result).length > 0 ? result : null;
}
