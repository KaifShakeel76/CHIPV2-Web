import { toast } from 'sonner';
import { z } from 'zod';

// Production-level error handling utilities

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  field?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Error type guards
export const isApiError = (error: unknown): error is ApiError => {
  return typeof error === 'object' && error !== null && 'message' in error;
};

export const isValidationError = (error: unknown): error is z.ZodError => {
  return error instanceof z.ZodError;
};

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof Error && (
    error.message.includes('Network') ||
    error.message.includes('Failed to fetch') ||
    error.message.includes('ERR_NETWORK')
  );
};

// Error transformation utilities
export const transformApiError = (error: unknown): ApiError => {
  if (isApiError(error)) {
    return error;
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
    };
  }
  
  if (typeof error === 'string') {
    return {
      message: error,
      status: 500,
    };
  }
  
  return {
    message: 'An unexpected error occurred',
    status: 500,
  };
};

export const transformValidationErrors = (error: z.ZodError): ValidationError[] => {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
  }));
};

// Error handling classes
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: Array<{ error: ApiError; timestamp: number }> = [];
  private readonly maxQueueSize = 10;
  private readonly duplicateTimeWindow = 5000; // 5 seconds

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private isDuplicateError(error: ApiError): boolean {
    const now = Date.now();
    return this.errorQueue.some(
      item =>
        item.error.message === error.message &&
        now - item.timestamp < this.duplicateTimeWindow
    );
  }

  private addToQueue(error: ApiError): void {
    const now = Date.now();
    this.errorQueue.push({ error, timestamp: now });
    
    // Clean old errors
    this.errorQueue = this.errorQueue.filter(
      item => now - item.timestamp < this.duplicateTimeWindow
    );
    
    // Limit queue size
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue = this.errorQueue.slice(-this.maxQueueSize);
    }
  }

  handleError(error: unknown, context?: string): void {
    const apiError = transformApiError(error);
    
    // Prevent duplicate error notifications
    if (this.isDuplicateError(apiError)) {
      return;
    }
    
    this.addToQueue(apiError);
    
    // Log error for debugging
    console.error('Error handled:', {
      error: apiError,
      context,
      timestamp: new Date().toISOString(),
    });
    
    // Show user-friendly error message
    this.showErrorToast(apiError, context);
  }

  private showErrorToast(error: ApiError, context?: string): void {
    const message = this.getErrorMessage(error, context);
    
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
    });
  }

  private getErrorMessage(error: ApiError, context?: string): string {
    // Network errors
    if (isNetworkError(error)) {
      return 'Network connection failed. Please check your internet connection.';
    }
    
    // Authentication errors
    if (error.status === 401) {
      return 'Session expired. Please log in again.';
    }
    
    // Authorization errors
    if (error.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    
    // Validation errors
    if (error.status === 422) {
      return error.message || 'Please check your input and try again.';
    }
    
    // Server errors
    if (error.status && error.status >= 500) {
      return 'Server error. Please try again later.';
    }
    
    // Context-specific messages
    if (context) {
      const contextMessages: Record<string, string> = {
        login: 'Login failed. Please check your credentials.',
        registration: 'Registration failed. Please try again.',
        otp: 'OTP verification failed. Please check your code.',
        'forgot-password': 'Password reset failed. Please try again.',
      };
      
      return contextMessages[context] || error.message;
    }
    
    return error.message || 'An error occurred. Please try again.';
  }

  handleValidationError(error: z.ZodError, showToast: boolean = true): ValidationError[] {
    const validationErrors = transformValidationErrors(error);
    
    if (showToast && validationErrors.length > 0) {
      const firstError = validationErrors[0];
      toast.error(firstError.message, {
        duration: 4000,
        position: 'top-right',
      });
    }
    
    return validationErrors;
  }

  clearErrors(): void {
    this.errorQueue = [];
  }
}

// Singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Utility functions for common error scenarios
export const handleApiError = (error: unknown, context?: string): void => {
  errorHandler.handleError(error, context);
};

export const handleValidationError = (
  error: z.ZodError,
  showToast: boolean = true
): ValidationError[] => {
  return errorHandler.handleValidationError(error, showToast);
};

export const handleFormError = (error: unknown, context?: string): boolean => {
  if (isValidationError(error)) {
    handleValidationError(error, true);
    return false;
  }
  
  handleApiError(error, context);
  return true;
};

// React Error Boundary compatible error handler
export const handleComponentError = (
  error: Error,
  errorInfo: { componentStack: string }
): void => {
  console.error('Component error:', error, errorInfo);
  
  toast.error('Something went wrong. Please refresh the page.', {
    duration: 8000,
    position: 'top-center',
  });
};

// Promise error handler
export const handlePromiseError = (promise: Promise<any>, context?: string): Promise<any> => {
  return promise.catch(error => {
    handleApiError(error, context);
    throw error; // Re-throw to allow caller to handle
  });
};

// Async function wrapper with error handling
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleApiError(error, context);
      throw error;
    }
  }) as T;
};

// Error boundary hook
export const useErrorHandler = () => {
  const handleError = (error: unknown, context?: string) => {
    errorHandler.handleError(error, context);
  };

  const handleValidation = (error: z.ZodError, showToast: boolean = true) => {
    return errorHandler.handleValidationError(error, showToast);
  };

  const clearErrors = () => {
    errorHandler.clearErrors();
  };

  return {
    handleError,
    handleValidation,
    clearErrors,
  };
};

// Type-safe error messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network connection failed. Please check your internet connection.',
  UNAUTHORIZED: 'Session expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  VALIDATION: 'Please check your input and try again.',
  SERVER: 'Server error. Please try again later.',
  UNKNOWN: 'An unexpected error occurred. Please try again.',
  
  // Auth specific
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  OTP_FAILED: 'OTP verification failed. Please check your code.',
  PASSWORD_RESET_FAILED: 'Password reset failed. Please try again.',
  
  // Form specific
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_MOBILE: 'Please enter a valid mobile number.',
  INVALID_OTP: 'Please enter a valid 6-digit OTP.',
  PASSWORD_MISMATCH: "Passwords don't match.",
  WEAK_PASSWORD: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
} as const;