// src/components/StepProgress.tsx
import React from 'react';
import { AUTH_CONFIG } from '@/components/auth/config/auth.config';

interface StepProgressProps {
  currentStep: number;
}

interface Step {
  step: number;
  label: string;
  iconType: string;
}

const steps: Step[] = AUTH_CONFIG.REGISTRATION_STEPS;

export const StepProgress: React.FC<StepProgressProps> = ({ currentStep }) => {
  // Function to get the appropriate icon based on step status and type
  const getStepIcon = (stepNumber: number, iconType: string): string => {
    if (currentStep > stepNumber) {
      
      switch (iconType) {
        case "verification":
          return "src/assets/icons/verification2.svg";
        case "geo":
          return "src/assets/icons/geo3.svg";
        case "pi":
          return "src/assets/icons/pi3.svg";
        case "approval":
          return "src/icons/approval2.svg";
        default:
          return "";
      }
    } else if (currentStep === stepNumber) {
      
      switch (iconType) {
        case "verification":
          return "src/assets/icons/verification1.svg";
        case "geo":
          return "src/assets/icons/geo2.svg";
        case "pi":
          return "src/assets/icons/pi2.svg";
        case "approval":
          return "src/assets/icons/approval2.svg";
        default:
          return "";
      }
    } else {
    
      switch (iconType) {
        case "verification":
          
          return "src/assets/icons/geo1.svg";
        case "geo":
          return "src/assets/icons/geo1.svg";
        case "pi":
          return "src/assets/icons/pi1.svg";
        case "approval":
          return "src/assets/icons/approval1.svg";
        default:
          return "";
      }
    }
  };

  return (
    <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 lg:px-0 mb-4">
      {steps.map((item, index) => {
        const isCompleted = currentStep > item.step;
        const isCurrent = currentStep === item.step;
        const isLast = index === steps.length - 1;
        const iconSrc = getStepIcon(item.step, item.iconType);

        return (
          <div key={item.step} className="flex flex-col items-center flex-1 relative">
            {/* Connecting Line */}
            {!isLast && (
              <div className="absolute top-[20px] left-1/2 w-full z-0">
                <div className="h-0.5 w-full bg-secondary relative">
                  <div
                    className={`h-full absolute top-0 left-0 transition-all duration-500 ${
                      currentStep > item.step ? "w-full bg-gradient-to-r from-primary to-primary" : "w-0"
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Step Circle with Icon */}
            <div className="z-10">
              {isCompleted ? (
                <div className="bg-success w-9 h-9 rounded-full flex items-center justify-center text-background">
                  <img
                    src={iconSrc || "/placeholder.svg"}
                    alt={`${item.label} completed`}
                    width={39}
                    height={38}
                    className="w-9 h-9"
                  />
                </div>
              ) : isCurrent ? (
                <div className="bg-primary w-9 h-9 rounded-full flex items-center justify-center text-background shadow-md">
                  <img
                    src={iconSrc || "/placeholder.svg"}
                    alt={`${item.label} active`}
                    width={39}
                    height={38}
                    className="w-9 h-9"
                  />
                </div>
              ) : (
                <div className="border-2 border-accent text-accent w-9 h-9 rounded-full flex items-center justify-center bg-background">
                  <img
                    src={iconSrc || "/placeholder.svg"}
                    alt={`${item.label} inactive`}
                    width={39}
                    height={38}
                    className="w-9 h-9"
                  />
                </div>
              )}
            </div>

            {/* Step Label */}
            <span
              className={`mt-1 text-xs sm:text-sm font-medium ${isCurrent ? "text-primary" : "text-muted-foreground"}`}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};