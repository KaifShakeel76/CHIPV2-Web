import { createApi } from '@reduxjs/toolkit/query/react';
import axiosInstance from '../../lib/axiosInstance';

// Geographic Data Types
interface State {
  id: number;
  name_en: string;
  name_local: string;
  name_hi?: string;
  name_mr?: string;
  name_kn?: string;
  lgd_code: number;
  census_code_2011: number;
  is_native: boolean;
  status: number;
  created_at: string;
  updated_at: string;
}

interface District {
  id: number;
  state_id: number;
  name_en: string;
  name_local: string;
  lgd_code: number;
  census_code_2011: number;
  is_dashboard_user: boolean;
  registration_flag: number;
  status: number;
  created_at: string;
  updated_at: string;
}

interface Block {
  id: number;
  district_id: number;
  name_en: string;
  name_local: string;
  lgd_code: number;
  census_code_2011: number;
  is_urban: boolean;
  is_dashboard_user: boolean;
  registration_flag: number;
  status: number;
  created_at: string;
  updated_at: string;
}

// API Response Types
interface StatesResponse {
  data: State[];
  count?: number;
}

interface DistrictsResponse {
  data: District[];
  count?: number;
  state?: {
    id: number;
    name_en: string;
    name_local: string;
  };
}

interface BlocksResponse {
  data: Block[];
  count?: number;
  district?: {
    id: number;
    name_en: string;
  };
  state?: {
    id: number;
    name_en: string;
  };
}

// Custom base query using our secure Axios instance
const axiosBaseQuery = () => async (args: any) => {
  try {
    const result = await axiosInstance.request({
      url: args.url || args,
      method: args.method || 'GET',
      data: args.data,
      params: args.params,
    });
    return { data: result.data };
  } catch (error: any) {
    return {
      error: {
        status: error.response?.status,
        data: error.response?.data || error.message,
      },
    };
  }
};

// RTK Query API slice for registration data
export const registrationDataApiSlice = createApi({
  reducerPath: 'registrationDataApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['States', 'Districts', 'Blocks'],
  keepUnusedDataFor: Number(import.meta.env.VITE_CACHE_DURATION) || 300, // Keep cache for 5 minutes
  refetchOnMountOrArgChange: 30, // Refetch if data is older than 30 seconds
  endpoints: (builder) => ({
    // Geographic Data Endpoints
    getStates: builder.query<StatesResponse, void>({
      query: () => import.meta.env.VITE_GEOGRAPHY_STATES_ENDPOINT || '/geography/states',
      providesTags: ['States'],
      transformResponse: (response: StatesResponse) => {
        console.log('📍 States fetched:', response);
        return response;
      },
      transformErrorResponse: (error: any) => {
        console.error('❌ Error fetching states:', error);
        return error;
      },
    }),

    getDistricts: builder.query<DistrictsResponse, { stateId: number }>({
      query: ({ stateId }) => `${import.meta.env.VITE_GEOGRAPHY_STATES_ENDPOINT || '/geography/states'}/${stateId}/districts`,
      providesTags: (_, __, { stateId }) => [
        { type: 'Districts', id: stateId },
        'Districts',
      ],
      transformResponse: (response: DistrictsResponse) => {
        console.log('📍 Districts fetched:', response);
        return response;
      },
      transformErrorResponse: (error: any) => {
        console.error('❌ Error fetching districts:', error);
        return error;
      },
    }),

    getBlocks: builder.query<BlocksResponse, { districtId: number }>({
      query: ({ districtId }) => `${import.meta.env.VITE_GEOGRAPHY_DISTRICTS_ENDPOINT || '/geography/districts'}/${districtId}/blocks`,
      providesTags: (_, __, { districtId }) => [
        { type: 'Blocks', id: districtId },
        'Blocks',
      ],
      transformResponse: (response: BlocksResponse) => {
        console.log('📍 Blocks fetched:', response);
        return response;
      },
      transformErrorResponse: (error: any) => {
        console.error('❌ Error fetching blocks:', error);
        return error;
      },
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetStatesQuery,
  useGetDistrictsQuery,
  useGetBlocksQuery,
} = registrationDataApiSlice;

// Export API slice reducer
export default registrationDataApiSlice.reducer;

// Selectors for optimized data access
export const selectRegistrationDataApiState = (state: any) => state.registrationDataApi;

// Helper functions for common operations
export const createGeographicQueryParams = (
  stateId?: number,
  districtId?: number,
  blockId?: number
) => ({
  ...(stateId && { stateId }),
  ...(districtId && { districtId }),
  ...(blockId && { blockId }),
});