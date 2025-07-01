// Auth component types (referenced in index.ts)

export interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export interface OtpSectionProps {
  onVerification?: (verified: boolean) => void;
  phoneNumber?: string;
}

export interface RegisterDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}