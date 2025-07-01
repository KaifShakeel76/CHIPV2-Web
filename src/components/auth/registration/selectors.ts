import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from "@/app/store"

// Optimized selectors to prevent unnecessary re-renders
export const selectRegistrationStep = (state: RootState) => state.registerForm.step

// Memoized contact info selector - only returns what's needed
export const selectContactVerification = createSelector(
  (state: RootState) => state.registerForm.contactInfo,
  (contactInfo) => ({
    mobileVerified: contactInfo.mobileVerified,
    whatsappVerified: contactInfo.whatsappVerified,
    emailVerified: contactInfo.emailVerified,
    mobileNumber: contactInfo.mobileNumber,
    whatsappNumber: contactInfo.whatsappNumber,
    email: contactInfo.email
  })
)

// Memoized level info selector - only essential fields
export const selectLevelInfo = createSelector(
  (state: RootState) => state.registerForm.levelInfo,
  (levelInfo) => ({
    selectedLevel: levelInfo.selectedLevel,
    state: levelInfo.state,
    division: levelInfo.division,
    district: levelInfo.district,
    block: levelInfo.block,
    sector: levelInfo.sector,
    organizationTypeId: levelInfo.organizationTypeId,
    organizationId: levelInfo.organizationId,
    designationId: levelInfo.designationId,
    organizationTypeLabel: levelInfo.organizationTypeLabel,
    organizationLabel: levelInfo.organizationLabel,
    designationLabel: levelInfo.designationLabel
  })
)

// Memoized personal info selector - only what's needed for validation
export const selectPersonalInfo = createSelector(
  (state: RootState) => state.registerForm.personalInfo,
  (personalInfo) => ({
    firstName: personalInfo.firstName,
    password: personalInfo.password,
    confirmPassword: personalInfo.confirmPassword
  })
)

// Combined selector for review info - only compute when needed
export const selectReviewInfo = createSelector(
  [selectContactVerification, selectLevelInfo, selectPersonalInfo],
  (contactInfo, levelInfo, personalInfo) => ({
    ...contactInfo,
    ...levelInfo,
    ...personalInfo,
    organizationType: levelInfo.organizationTypeId || "",
    organization: levelInfo.organizationId || "",
    designation: levelInfo.designationId || ""
  })
)

// Optimized step validation selectors
export const selectCanProceedStep1 = createSelector(
  [selectContactVerification],
  (contactInfo) => {
    const { mobileVerified, whatsappVerified, emailVerified, mobileNumber, whatsappNumber, email } = contactInfo
    return !!(mobileNumber && whatsappNumber && email && mobileVerified && whatsappVerified && emailVerified)
  }
)

export const selectCanProceedStep2 = createSelector(
  [selectLevelInfo],
  (levelInfo) => {
    const { selectedLevel, state, organizationTypeId, organizationId, designationId } = levelInfo
    return !!(selectedLevel && state && organizationTypeId && organizationId && designationId)
  }
)

export const selectCanProceedStep3 = createSelector(
  [selectPersonalInfo],
  (personalInfo) => {
    const { firstName, password, confirmPassword } = personalInfo
    return !!(firstName && password && confirmPassword && password === confirmPassword)
  }
)