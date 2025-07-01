import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

// Types for geographic and organizational data
interface GeoOption {
  id: string;
  name: string;
}


// Enhanced base query with error handling
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
    
    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, 1000));
    result = await baseQuery(args, api, extraOptions);
  }

  return result;
};

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
      query: () => '/states',
      providesTags: ['States'],
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        message: (response.data as any)?.message || 'Failed to load states',
      }),
    }),

    getDivisions: builder.query<GeoOption[], string>({
      query: (stateId) => `/divisions?stateId=${stateId}`,
      providesTags: ['Divisions'],
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        message: (response.data as any)?.message || 'Failed to load divisions',
      }),
    }),

    getDistricts: builder.query<GeoOption[], string>({
      query: (divisionId) => `/districts?divisionId=${divisionId}`,
      providesTags: ['Districts'],
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        message: (response.data as any)?.message || 'Failed to load districts',
      }),
    }),

    getBlocks: builder.query<GeoOption[], string>({
      query: (districtId) => `/blocks?districtId=${districtId}`,
      providesTags: ['Blocks'],
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        message: (response.data as any)?.message || 'Failed to load blocks',
      }),
    }),

    getSectors: builder.query<GeoOption[], string>({
      query: (blockId) => `/sectors?blockId=${blockId}`,
      providesTags: ['Sectors'],
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        message: (response.data as any)?.message || 'Failed to load sectors',
      }),
    }),

    // Organizational Data Endpoints
    getOrgTypes: builder.query<GeoOption[], string>({
      query: (stateId) => `/organizationTypes?stateId=${stateId}`,
      providesTags: ['OrgTypes'],
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        message: (response.data as any)?.message || 'Failed to load organization types',
      }),
    }),

    getOrganizations: builder.query<GeoOption[], string>({
      query: (orgTypeId) => `/organizations?orgTypeId=${orgTypeId}`,
      providesTags: ['Organizations'],
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        message: (response.data as any)?.message || 'Failed to load organizations',
      }),
    }),

    getDesignations: builder.query<GeoOption[], string>({
      query: (organizationId) => `/designations?organizationId=${organizationId}`,
      providesTags: ['Designations'],
      transformErrorResponse: (response: FetchBaseQueryError) => ({
        status: response.status,
        message: (response.data as any)?.message || 'Failed to load designations',
      }),
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