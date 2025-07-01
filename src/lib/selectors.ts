import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';

// Performance-optimized selectors with memoization

// Auth selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectLoginTab = (state: RootState) => state.loginTab;
export const selectOtp = (state: RootState) => state.otp;

// Memoized auth selectors
export const selectIsAuthenticated = createSelector(
  [selectAuth],
  (auth) => !!auth.token && !!auth.user
);

export const selectAuthUser = createSelector(
  [selectAuth],
  (auth) => auth.user
);

export const selectAuthLoading = createSelector(
  [selectAuth],
  (auth) => auth.loading
);

export const selectAuthError = createSelector(
  [selectAuth],
  (auth) => auth.error
);

// Login tab selectors
export const selectActiveTab = createSelector(
  [selectLoginTab],
  (loginTab) => loginTab.activeTab
);

export const selectShowOtp = createSelector(
  [selectLoginTab],
  (loginTab) => loginTab.showOtp
);

// OTP selectors with performance optimization
export const selectOtpByType = createSelector(
  [selectOtp, (state: RootState, type: 'mobile' | 'email' | 'whatsapp') => type],
  (otp, type) => ({
    isVerified: otp.verifiedFields[type] || false,
    isLoading: otp.loadingStates[type] || false,
    countdown: otp.countdowns[type] || 0,
    canResend: (otp.countdowns[type] || 0) === 0,
    attempts: otp.attempts[type] || 0,
    maxAttempts: 3,
    attemptsRemaining: 3 - (otp.attempts[type] || 0),
  })
);

export const selectOtpStates = createSelector(
  [selectOtp],
  (otp) => ({
    mobile: {
      isVerified: otp.verifiedFields.mobile || false,
      isLoading: otp.loadingStates.mobile || false,
      countdown: otp.countdowns.mobile || 0,
      canResend: (otp.countdowns.mobile || 0) === 0,
    },
    email: {
      isVerified: otp.verifiedFields.email || false,
      isLoading: otp.loadingStates.email || false,
      countdown: otp.countdowns.email || 0,
      canResend: (otp.countdowns.email || 0) === 0,
    },
    whatsapp: {
      isVerified: otp.verifiedFields.whatsapp || false,
      isLoading: otp.loadingStates.whatsapp || false,
      countdown: otp.countdowns.whatsapp || 0,
      canResend: (otp.countdowns.whatsapp || 0) === 0,
    },
  })
);

// Registration form selectors
export const selectRegisterForm = (state: RootState) => state.registerForm;

export const selectRegistrationStep = createSelector(
  [selectRegisterForm],
  (registerForm) => registerForm.step
);

export const selectContactInfo = createSelector(
  [selectRegisterForm],
  (registerForm) => registerForm.contactInfo
);

export const selectLevelInfo = createSelector(
  [selectRegisterForm],
  (registerForm) => registerForm.levelInfo
);

export const selectPersonalInfo = createSelector(
  [selectRegisterForm],
  (registerForm) => registerForm.personalInfo
);

// Complex registration validation selectors
export const selectIsStep1Valid = createSelector(
  [selectContactInfo],
  (contactInfo) => {
    const { mobileVerified, whatsappVerified, emailVerified, mobileNumber, whatsappNumber, email } = contactInfo;
    return !!(
      mobileNumber && whatsappNumber && email &&
      mobileVerified && whatsappVerified && emailVerified
    );
  }
);

export const selectIsStep2Valid = createSelector(
  [selectLevelInfo],
  (levelInfo) => {
    const { selectedLevel, state, organizationTypeId, organizationId, designationId } = levelInfo;
    
    if (!selectedLevel || !state || !organizationTypeId || !organizationId || !designationId) {
      return false;
    }

    // Check geographic fields based on selected level
    const levelIndex = ["State", "Division", "District", "Block", "PHC"].indexOf(selectedLevel);
    
    if (levelIndex >= 1 && !levelInfo.division) return false;
    if (levelIndex >= 2 && !levelInfo.district) return false;
    if (levelIndex >= 3 && !levelInfo.block) return false;
    if (levelIndex >= 4 && !levelInfo.sector) return false;
    
    return true;
  }
);

export const selectIsStep3Valid = createSelector(
  [selectPersonalInfo],
  (personalInfo) => {
    const { firstName, password, confirmPassword } = personalInfo;
    
    if (!firstName || !password || !confirmPassword) {
      return false;
    }
    
    if (password !== confirmPassword) {
      return false;
    }
    
    // Check password requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
  }
);

export const selectCanProceedToNextStep = createSelector(
  [selectRegistrationStep, selectIsStep1Valid, selectIsStep2Valid, selectIsStep3Valid],
  (step, isStep1Valid, isStep2Valid, isStep3Valid) => {
    switch (step) {
      case 1:
        return isStep1Valid;
      case 2:
        return isStep2Valid;
      case 3:
        return isStep3Valid;
      default:
        return true;
    }
  }
);

// Geographic data selectors
export const selectGeoData = (state: RootState) => state.geoData;
export const selectStateData = (state: RootState) => state.state;

export const selectGeoLoadingStates = createSelector(
  [selectGeoData],
  (geoData) => geoData.loadingStates
);

export const selectGeoDataByType = createSelector(
  [selectGeoData, (state: RootState, type: string) => type],
  (geoData, type) => {
    switch (type) {
      case 'states':
        return geoData.states;
      case 'divisions':
        return geoData.divisions;
      case 'districts':
        return geoData.districts;
      case 'blocks':
        return geoData.blocks;
      case 'sectors':
        return geoData.sectors;
      case 'organizationTypes':
        return geoData.organizationTypes;
      case 'organizations':
        return geoData.organizations;
      case 'designations':
        return geoData.designations;
      default:
        return [];
    }
  }
);

// Combined registration data selector for review
export const selectRegistrationReviewData = createSelector(
  [selectContactInfo, selectLevelInfo, selectPersonalInfo],
  (contactInfo, levelInfo, personalInfo) => ({
    ...contactInfo,
    ...levelInfo,
    ...personalInfo,
    organizationType: levelInfo.organizationTypeId || "",
    organization: levelInfo.organizationId || "",
    designation: levelInfo.designationId || "",
    organizationTypeLabel: levelInfo.organizationTypeLabel || "",
    organizationLabel: levelInfo.organizationLabel || "",
    designationLabel: levelInfo.designationLabel || "",
  })
);

// Performance monitoring selectors
export const selectAppLoadingStates = createSelector(
  [selectAuth, selectOtp, selectGeoData],
  (auth, otp, geoData) => ({
    auth: auth.loading,
    otp: Object.values(otp.loadingStates).some(Boolean),
    geoData: Object.values(geoData.loadingStates).some(Boolean),
    hasAnyLoading: auth.loading || 
      Object.values(otp.loadingStates).some(Boolean) ||
      Object.values(geoData.loadingStates).some(Boolean),
  })
);

export const selectAppErrors = createSelector(
  [selectAuth, selectOtp, selectGeoData],
  (auth, otp, geoData) => ({
    auth: auth.error,
    otp: otp.error,
    geoData: geoData.error,
    hasAnyError: !!(auth.error || otp.error || geoData.error),
    allErrors: [auth.error, otp.error, geoData.error].filter(Boolean),
  })
);