import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

// Types for geographic and organizational data
interface GeoOption {
  id: string;
  name: string;
}

interface ApiResponseData {
  data: any[];
  count: number;
}

// Shared transformation function to reduce code duplication
const transformApiResponse = (response: ApiResponseData): GeoOption[] => {
  if (response.data && Array.isArray(response.data)) {
    return response.data.map((item: any) => ({
      id: item.id.toString(),
      name: item.name_en || item.name
    }));
  }
  return [];
};

// Shared error transformation function
const transformErrorResponse = (response: FetchBaseQueryError, context: string) => ({
  status: response.status,
  message: (response.data as any)?.message || `Failed to load ${context}`,
});

// Enhanced base query with error handling
const baseQueryWithRetry: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      
      // Add API key - required for geography endpoints
      const apiKey = import.meta.env.VITE_API_KEY;
      const apiKeyHeader = import.meta.env.VITE_API_KEY_HEADER_NAME || 'X-API-KEY';
      if (apiKey) {
        headers.set(apiKeyHeader, apiKey);
      }
      
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  // Retry logic for network errors
  if (result.error && result.error.status === 'FETCH_ERROR') {
    console.warn('Network error, retrying...', result.error);
    
    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, 1000));
    result = await baseQuery(args, api, extraOptions);
  }

  return result;
};

// Helper function removed due to TypeScript compatibility issues with RTK Query generics

// RTK Query API slice for geographic and organizational data
export const geoApiSlice = createApi({
  reducerPath: 'geoApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['States', 'Divisions', 'Districts', 'Blocks', 'Sectors', 'OrgTypes', 'Organizations', 'Designations'],
  keepUnusedDataFor: 300, // Keep cache for 5 minutes
  refetchOnMountOrArgChange: 600, // Refetch if data is older than 10 minutes
  endpoints: (builder) => ({
    // Geographic Data Endpoints
    getStates: builder.query<GeoOption[], void>({
      query: () => '/geography/states',
      providesTags: ['States'],
      transformResponse: transformApiResponse,
      transformErrorResponse: (response: FetchBaseQueryError) => transformErrorResponse(response, 'states'),
    }),

    getDivisions: builder.query<GeoOption[], number>({
      queryFn: async () => {
        // Divisions endpoint doesn't exist in API, return empty array
        return { data: [] };
      },
      providesTags: ['Divisions'],
    }),

    getDistricts: builder.query<GeoOption[], number>({
      query: (stateId: number) => `/geography/states/${stateId}/districts`,
      providesTags: ['Districts'],
      transformResponse: transformApiResponse,
      transformErrorResponse: (response: FetchBaseQueryError) => transformErrorResponse(response, 'districts'),
    }),

    getBlocks: builder.query<GeoOption[], number>({
      query: (districtId: number) => `/geography/districts/${districtId}/blocks`,
      providesTags: ['Blocks'],
      transformResponse: transformApiResponse,
      transformErrorResponse: (response: FetchBaseQueryError) => transformErrorResponse(response, 'blocks'),
    }),

    getSectors: builder.query<GeoOption[], number>({
      query: (blockId: number) => `/geography/blocks/${blockId}/health_facilities`,
      providesTags: ['Sectors'],
      transformResponse: transformApiResponse,
      transformErrorResponse: (response: FetchBaseQueryError) => transformErrorResponse(response, 'health facilities'),
    }),

    // Organizational Data Endpoints
    getOrgTypes: builder.query<GeoOption[], void>({
      query: () => '/organization_types',
      providesTags: ['OrgTypes'],
      transformResponse: transformApiResponse,
      transformErrorResponse: (response: FetchBaseQueryError) => transformErrorResponse(response, 'organization types'),
    }),

    getOrganizations: builder.query<GeoOption[], number>({
      query: (orgTypeId: number) => `/organizations?organization_type_id=${orgTypeId}`,
      providesTags: ['Organizations'],
      transformResponse: transformApiResponse,
      transformErrorResponse: (response: FetchBaseQueryError) => transformErrorResponse(response, 'organizations'),
    }),

    getDesignations: builder.query<GeoOption[], { organizationLevelId: number; organizationId: number }>({
      query: ({ organizationLevelId, organizationId }) => 
        `/organization_designations?organization_level_id=${organizationLevelId}&organization_id=${organizationId}`,
      providesTags: ['Designations'],
      transformResponse: transformApiResponse,
      transformErrorResponse: (response: FetchBaseQueryError) => transformErrorResponse(response, 'designations'),
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetStatesQuery,
  useGetDivisionsQuery,
  useGetDistrictsQuery,
  useGetBlocksQuery,
  useGetSectorsQuery,
  useGetOrgTypesQuery,
  useGetOrganizationsQuery,
  useGetDesignationsQuery,
} = geoApiSlice;

// Export API slice reducer
export default geoApiSlice.reducer;

// Utility functions for error handling
export const handleGeoApiError = (error: any, context?: string): string => {
  if (error.status === 404) {
    return `${context || 'Data'} not found. Please try again.`;
  } else if (error.status === 500) {
    return 'Server error. Please try again later.';
  } else if (error.status === 'FETCH_ERROR') {
    return 'Network error. Please check your internet connection.';
  } else {
    return error.data?.message || `Failed to load ${context || 'data'}. Please try again.`;
  }
};

// Type exports for better reusability
export type { GeoOption };