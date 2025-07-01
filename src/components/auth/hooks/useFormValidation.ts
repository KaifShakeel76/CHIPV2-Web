import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useCallback, useMemo, useRef } from 'react';
import type { FieldValues, Path, UseFormReturn, DefaultValues } from 'react-hook-form';
import type { z } from 'zod';

interface FormValidationConfig<T extends FieldValues> {
  schema: z.ZodSchema<T>;
  defaultValues?: DefaultValues<T>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}

interface ValidationMessages<T extends FieldValues> {
  required?: Partial<Record<keyof T, string>>;
  invalid?: Partial<Record<keyof T, string>>;
}

interface UseFormValidationReturn<T extends FieldValues> extends Omit<UseFormReturn<T>, 'handleSubmit'> {
  handleFieldChange: (field: Path<T>) => (value: string) => Promise<void>;
  handleValidatedSubmit: (onSubmit: (data: T) => Promise<void> | void) => () => Promise<void>;
  validateField: (field: Path<T>, showError?: boolean) => Promise<boolean>;
  validateAllFields: (showErrors?: boolean) => Promise<boolean>;
  getFieldError: (field: Path<T>) => string | undefined;
  isFieldValid: (field: Path<T>) => boolean;
  hasErrors: boolean;
  isSubmitting: boolean;
  debouncedValidateField: (field: Path<T>, value: string) => void;
}

export function useFormValidation<T extends FieldValues>(
  config: FormValidationConfig<T>,
  messages?: ValidationMessages<T>
): UseFormValidationReturn<T> {
  const form = useForm<T>({
    resolver: zodResolver(config.schema as any),
    defaultValues: config.defaultValues,
    mode: config.mode || 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  const {
    handleSubmit,
    setValue,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = form;

  // Debounce timer ref
  const debounceTimerRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Memoized validation helper
  const validateField = useCallback(
    async (field: Path<T>, showError: boolean = true): Promise<boolean> => {
      const isFieldValid = await trigger(field);
      
      if (!isFieldValid && showError) {
        const error = errors[field];
        const customMessage = messages?.invalid?.[field];
        const errorMessage = customMessage || (error?.message as string) || `Invalid ${String(field)}`;
        toast.error(errorMessage);
      }
      
      return isFieldValid;
    },
    [trigger, errors, messages]
  );

  // Debounced validation function
  const debouncedValidateField = useCallback(
    (field: Path<T>, value: string): void => {
      const fieldKey = String(field);
      
      // Clear existing timer for this field
      if (debounceTimerRef.current[fieldKey]) {
        clearTimeout(debounceTimerRef.current[fieldKey]);
      }
      
      // Set new timer
      debounceTimerRef.current[fieldKey] = setTimeout(() => {
        setValue(field, value as T[Path<T>], { 
          shouldValidate: true,
          shouldDirty: true,
        });
        validateField(field, false);
      }, 300); // 300ms debounce delay
    },
    [setValue, validateField]
  );

  // Optimized field change handler with debouncing capability
  const handleFieldChange = useCallback(
    (field: Path<T>) => 
      async (value: string): Promise<void> => {
        setValue(field, value as T[Path<T>], { 
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true 
        });
        
        // Trigger validation after setValue
        await trigger(field);
      },
    [setValue, trigger]
  );

  // Comprehensive validation with user feedback
  const validateAllFields = useCallback(
    async (showErrors: boolean = true): Promise<boolean> => {
      const currentValues = getValues();
      const requiredFields = Object.keys(config.defaultValues || {}) as Array<keyof T>;
      
      // Check for empty required fields
      const emptyFields = requiredFields.filter(field => {
        const value = currentValues[field];
        return !value || (typeof value === 'string' && value.trim() === '');
      });
      
      if (emptyFields.length > 0 && showErrors) {
        const fieldNames = emptyFields.map(field => 
          messages?.required?.[field] || String(field)
        ).join(', ');
        toast.error(`Please fill in: ${fieldNames}`);
        return false;
      }
      
      // Trigger schema validation
      const isFormValid = await trigger();
      
      if (!isFormValid && showErrors) {
        const firstError = Object.values(errors)[0];
        const errorMessage = (firstError?.message as string) || 'Please fix the errors and try again';
        toast.error(errorMessage);
      }
      
      return isFormValid;
    },
    [getValues, trigger, errors, config.defaultValues, messages]
  );

  // Production-level submit handler with error boundaries
  const handleValidatedSubmit = useCallback(
    (onSubmit: (data: T) => Promise<void> | void) => 
      async (): Promise<void> => {
        try {
          const isValid = await validateAllFields(true);
          
          if (isValid) {
            await handleSubmit(async (data) => {
              try {
                await onSubmit(data);
              } catch (error) {
                console.error('Form submission error:', error);
                toast.error(error instanceof Error ? error.message : 'Submission failed');
                throw error;
              }
            })();
          }
        } catch (error) {
          console.error('Form validation error:', error);
          // Error already handled by validateAllFields or onSubmit
        }
      },
    [handleSubmit, validateAllFields]
  );

  // Utility functions for component optimization
  const getFieldError = useCallback(
    (field: Path<T>): string | undefined => errors[field]?.message as string | undefined,
    [errors]
  );

  const isFieldValid = useCallback(
    (field: Path<T>): boolean => !errors[field],
    [errors]
  );

  // Memoized computed values for performance
  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  return {
    ...form,
    handleFieldChange,
    handleValidatedSubmit,
    validateField,
    validateAllFields,
    getFieldError,
    isFieldValid,
    hasErrors,
    isSubmitting,
    debouncedValidateField,
  };
}

// Specialized hooks for common auth patterns
export function useLoginFormValidation<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  defaultValues?: DefaultValues<T>
): UseFormValidationReturn<T> {
  return useFormValidation(
    { schema, defaultValues, mode: 'onChange' },
    {
      required: {
        email: 'Email address',
        password: 'Password',
        mobile: 'Mobile number',
      } as Partial<Record<keyof T, string>>,
      invalid: {
        email: 'Please enter a valid email address',
        password: 'Password must meet the requirements',
        mobile: 'Please enter a valid mobile number',
      } as Partial<Record<keyof T, string>>,
    }
  );
}

export function useRegistrationFormValidation<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  defaultValues?: DefaultValues<T>
): UseFormValidationReturn<T> {
  return useFormValidation(
    { schema, defaultValues, mode: 'onChange' },
    {
      required: {
        firstName: 'First name',
        lastName: 'Last name',
        email: 'Email address',
        mobile: 'Mobile number',
        password: 'Password',
        confirmPassword: 'Password confirmation',
      } as Partial<Record<keyof T, string>>,
    }
  );
}