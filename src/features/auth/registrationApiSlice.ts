import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

// 🚀 Production-ready types for registration
export interface RegistrationRequest {
  // Step 1: Contact Information
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  
  // Step 2: Geographic & Organizational Info
  selectedLevel: string;
  state: string;
  stateLabel: string;
  division?: string;
  divisionLabel?: string;
  district?: string;
  districtLabel?: string;
  block?: string;
  blockLabel?: string;
  sector?: string;
  sectorLabel?: string;
  organizationTypeId: string;
  organizationTypeLabel: string;
  organizationId: string;
  organizationLabel: string;
  designationId: string;
  designationLabel: string;
  
  // Step 3: Personal Information
  firstName: string;
  lastName?: string;
  password: string; // Will be hashed before sending
}

export interface RegistrationResponse {
  success: boolean;
  userId: string;
  registrationId: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface DocumentUploadRequest {
  userId: string;
  documentType: 'id_proof' | 'certificate' | 'photo';
  file: File;
}

export interface DocumentUploadResponse {
  success: boolean;
  documentId: string;
  url: string;
  message: string;
}

export interface RegistrationStatusResponse {
  userId: string;
  status: 'pending' | 'approved' | 'rejected' | 'incomplete';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  completionPercentage: number;
  missingDocuments?: string[];
  nextSteps?: string[];
}

// Enhanced base query with retry logic
const baseQueryWithRetry: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3002',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  // Retry logic for network errors
  if (result.error && result.error.status === 'FETCH_ERROR') {
    console.warn('Network error, retrying...', result.error);
    await new Promise(resolve => setTimeout(resolve, 1000));
    result = await baseQuery(args, api, extraOptions);
  }

  return result;
};

// RTK Query API slice for registration
export const registrationApiSlice = createApi({
  reducerPath: 'registrationApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Registration', 'Documents', 'Status'],
  keepUnusedDataFor: 300, // Keep cache for 5 minutes
  endpoints: (builder) => ({
    // Submit complete registration
    submitRegistration: builder.mutation<RegistrationResponse, RegistrationRequest>({
      // TODO: Uncomment when API is ready
      // query: (registrationData) => ({
      //   url: '/auth/register',
      //   method: 'POST',
      //   body: registrationData,
      // }),
      // invalidatesTags: ['Registration'],

      // MOCK IMPLEMENTATION - Remove when API is ready
      queryFn: async (registrationData) => {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
        
        console.log('🚀 Mock Registration Submission:', registrationData);
        
        // Mock successful registration
        const mockResponse: RegistrationResponse = {
          success: true,
          userId: `user_${Date.now()}`,
          registrationId: `reg_${Date.now()}`,
          message: 'Registration submitted successfully! Your application is under review.',
          status: 'pending'
        };
        
        console.log('✅ Mock Registration Response:', mockResponse);
        return { data: mockResponse };
      },
      invalidatesTags: ['Registration'],
    }),

    // Upload supporting documents
    uploadDocument: builder.mutation<DocumentUploadResponse, DocumentUploadRequest>({
      // TODO: Uncomment when API is ready
      // query: ({ userId, documentType, file }) => {
      //   const formData = new FormData();
      //   formData.append('file', file);
      //   formData.append('documentType', documentType);
      //   return {
      //     url: `/auth/upload-documents/${userId}`,
      //     method: 'POST',
      //     body: formData,
      //   };
      // },
      // invalidatesTags: ['Documents'],

      // MOCK IMPLEMENTATION - Remove when API is ready
      queryFn: async ({ userId, documentType, file }) => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log('📄 Mock Document Upload:', { userId, documentType, fileName: file.name });
        
        const mockResponse: DocumentUploadResponse = {
          success: true,
          documentId: `doc_${Date.now()}`,
          url: `https://mock-storage.com/documents/${documentType}_${userId}`,
          message: `${documentType} uploaded successfully`
        };
        
        console.log('✅ Mock Document Response:', mockResponse);
        return { data: mockResponse };
      },
      invalidatesTags: ['Documents'],
    }),

    // Send verification email/SMS
    sendVerification: builder.mutation<{ success: boolean; message: string }, { userId: string; type: 'email' | 'sms' }>({
      // TODO: Uncomment when API is ready
      // query: ({ userId, type }) => ({
      //   url: '/auth/send-verification',
      //   method: 'POST',
      //   body: { userId, type },
      // }),

      // MOCK IMPLEMENTATION - Remove when API is ready
      queryFn: async ({ userId, type }) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('📧 Mock Send Verification:', { userId, type });
        
        const mockResponse = {
          success: true,
          message: `Verification ${type} sent successfully to user ${userId}`
        };
        
        console.log('✅ Mock Verification Response:', mockResponse);
        return { data: mockResponse };
      },
    }),

    // Check registration status
    getRegistrationStatus: builder.query<RegistrationStatusResponse, string>({
      // TODO: Uncomment when API is ready
      // query: (userId) => `/auth/registration-status/${userId}`,
      // providesTags: ['Status'],

      // MOCK IMPLEMENTATION - Remove when API is ready
      queryFn: async (userId) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        console.log('🔍 Mock Status Check:', userId);
        
        const mockResponse: RegistrationStatusResponse = {
          userId,
          status: 'pending',
          completionPercentage: 85,
          missingDocuments: ['id_proof'],
          nextSteps: [
            'Upload ID proof document',
            'Wait for admin review'
          ]
        };
        
        console.log('✅ Mock Status Response:', mockResponse);
        return { data: mockResponse };
      },
      providesTags: ['Status'],
    }),
  }),
});

// Export hooks for use in components
export const {
  useSubmitRegistrationMutation,
  useUploadDocumentMutation,
  useSendVerificationMutation,
  useGetRegistrationStatusQuery,
} = registrationApiSlice;

// Export API slice reducer
export default registrationApiSlice.reducer;

// Utility function for registration error handling
export const handleRegistrationError = (error: any): string => {
  if (error.status === 400) {
    return 'Invalid registration data. Please check all fields.';
  } else if (error.status === 409) {
    return 'User already exists with this email or mobile number.';
  } else if (error.status === 422) {
    return 'Registration data validation failed. Please review your information.';
  } else if (error.status === 500) {
    return 'Registration system error. Please try again later.';
  } else if (error.status === 'FETCH_ERROR') {
    return 'Network error. Please check your connection and try again.';
  } else {
    return error.data?.message || 'Registration failed. Please try again.';
  }
};