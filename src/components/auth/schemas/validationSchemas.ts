import { z } from 'zod';

// Reusable validation schemas for production-level validation

// Common field validations
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(100, 'Email must be less than 100 characters');

export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(50, 'Password must be less than 50 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

export const mobileSchema = z
  .string()
  .min(1, 'Mobile number is required')
  .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number');

export const otpSchema = z
  .string()
  .length(6, 'OTP must be exactly 6 digits')
  .regex(/^\d{6}$/, 'OTP must contain only numbers');

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

// Auth form schemas
export const emailLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const mobileLoginSchema = z.object({
  mobile: mobileSchema,
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const otpVerificationSchema = z.object({
  otp: otpSchema,
});

// Registration form schemas
export const step1VerificationSchema = z.object({
  mobileNumber: mobileSchema,
  whatsappNumber: mobileSchema,
  email: emailSchema,
  mobileVerified: z.boolean().refine(val => val === true, {
    message: 'Mobile number must be verified',
  }),
  whatsappVerified: z.boolean().refine(val => val === true, {
    message: 'WhatsApp number must be verified',
  }),
  emailVerified: z.boolean().refine(val => val === true, {
    message: 'Email must be verified',
  }),
});

export const step2UserDetailsSchema = z.object({
  selectedLevel: z.string().min(1, 'Please select your administrative level'),
  state: z.string().min(1, 'Please select your state'),
  division: z.string().optional(),
  district: z.string().optional(),
  block: z.string().optional(),
  sector: z.string().optional(),
  organizationTypeId: z.string().min(1, 'Please select organization type'),
  organizationId: z.string().min(1, 'Please select organization'),
  designationId: z.string().min(1, 'Please select designation'),
});

export const step3PersonalInfoSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema.optional(),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Combined registration schema
export const fullRegistrationSchema = step1VerificationSchema
  .merge(step2UserDetailsSchema)
  .merge(step3PersonalInfoSchema);

// Type exports for TypeScript
export type EmailLoginForm = z.infer<typeof emailLoginSchema>;
export type MobileLoginForm = z.infer<typeof mobileLoginSchema>;
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
export type OtpVerificationForm = z.infer<typeof otpVerificationSchema>;
export type Step1VerificationForm = z.infer<typeof step1VerificationSchema>;
export type Step2UserDetailsForm = z.infer<typeof step2UserDetailsSchema>;
export type Step3PersonalInfoForm = z.infer<typeof step3PersonalInfoSchema>;
export type FullRegistrationForm = z.infer<typeof fullRegistrationSchema>;

// Validation utilities
export const validateField = <T>(
  schema: z.ZodSchema<T>,
  field: keyof T,
  value: any
): { isValid: boolean; error?: string } => {
  try {
    const fieldSchema = schema.shape[field as string];
    if (fieldSchema) {
      fieldSchema.parse(value);
      return { isValid: true };
    }
    return { isValid: false, error: 'Field not found in schema' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message };
    }
    return { isValid: false, error: 'Validation failed' };
  }
};

export const validatePartialForm = <T>(
  schema: z.ZodSchema<T>,
  data: Partial<T>
): { isValid: boolean; errors: Record<string, string> } => {
  try {
    schema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
};

// Custom validation rules
export const createConditionalSchema = <T extends Record<string, any>>(
  baseSchema: z.ZodSchema<T>,
  conditions: Array<{
    when: (data: T) => boolean;
    then: z.ZodSchema<Partial<T>>;
    message?: string;
  }>
) => {
  return baseSchema.superRefine((data, ctx) => {
    conditions.forEach(({ when, then, message }) => {
      if (when(data)) {
        const result = then.safeParse(data);
        if (!result.success) {
          result.error.errors.forEach((err) => {
            ctx.addIssue({
              ...err,
              message: message || err.message,
            });
          });
        }
      }
    });
  });
};

// Geographic validation for Step 2
export const createGeographicValidationSchema = (selectedLevel: string) => {
  const levelIndex = ["State", "Division", "District", "Block", "PHC/CHC"].indexOf(selectedLevel);
  
  // Build dynamic schema based on selected level
  const baseFields = {
    selectedLevel: z.string().min(1, 'Please select your administrative level'),
    state: z.string().min(1, 'State is required'),
    organizationTypeId: z.string().optional(),
    organizationId: z.string().optional(),
    designationId: z.string().optional(),
  };

  // Add conditional geographic fields based on level
  const conditionalFields: Record<string, any> = {};
  
  if (levelIndex >= 1) {
    conditionalFields.division = z.string().min(1, 'Division is required for this level');
  } else {
    conditionalFields.division = z.string().optional();
  }
  
  if (levelIndex >= 2) {
    conditionalFields.district = z.string().min(1, 'District is required for this level');
  } else {
    conditionalFields.district = z.string().optional();
  }
  
  if (levelIndex >= 3) {
    conditionalFields.block = z.string().min(1, 'Block is required for this level');
  } else {
    conditionalFields.block = z.string().optional();
  }
  
  if (levelIndex >= 4) {
    conditionalFields.sector = z.string().min(1, 'PHC/CHC is required for this level');
  } else {
    conditionalFields.sector = z.string().optional();
  }
  
  return z.object({
    ...baseFields,
    ...conditionalFields
  });
};