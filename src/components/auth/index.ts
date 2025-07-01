
export { default as AuthGuard, withAuthGuard, useAuthStatus } from './common/AuthGuard';
export { default as LogoutButton } from './common/LogoutButton';

// Login components  
export { default as LoginContainer } from './login/LoginContainer';
export { default as EmailLogin } from './login/EmailLogin';
export { default as MobileLogin } from './login/MobileLogin';
export { default as ForgotPasswordForm } from './login/ForgotPasswordForm';

// Registration components
export { default as RegisterDrawer } from './registration/OptimizedRegistrationDrawer';
export { StepProgress } from './registration/RegistrationProgress';

// Registration steps
export { default as VerificationStep } from './registration/steps/VerificationStep';
export { default as UserDetailsStep } from './registration/steps/UserDetailsStep';
export { default as PersonalInfoStep } from './registration/steps/PersonalInfoStep';
export { default as ApprovalStep } from './registration/steps/ApprovalStep';

// OTP components
export { OtpSection } from './otp/OtpSection';
export { default as OtpVerification } from './otp/OtpVerification';

// Vehicle components (if auth-related)
export { default as CarSelector } from './vehicle/CarSelector';
export { default as MultiSelectCars } from './vehicle/MultiSelectCars';

// Dialog components
export { ApprovalDialog } from './dialogs/ApprovalDialog';

// Re-export commonly used types
export type { 
  AuthGuardProps,
  OtpSectionProps,
  RegisterDrawerProps
} from './types';
