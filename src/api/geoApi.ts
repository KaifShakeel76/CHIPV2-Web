import axios from "axios"

// Rails backend configuration
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:3000"
const BACKEND_API_VERSION = import.meta.env.VITE_BACKEND_API_VERSION || "v1"
const BASE_URL = `${BACKEND_BASE_URL}/${BACKEND_API_VERSION}`
const API_KEY = import.meta.env.VITE_API_KEY || "422e7c9463d2fe62b2804985cfff0d153b070a2f3d9bfd5d21c92013aba4fd74"

// Configure axios with required headers for Rails API
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-API-KEY': API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Required for session cookies
})

// Geography endpoints - Updated for Rails API
export const fetchStates = () => apiClient.get('/geography/states')

// COMMENTED OUT: Old division-based endpoints
// export const fetchDivisionsByState = (stateId: string) =>
//   axios.get(`${BASE_URL}/divisions`, { params: { stateId } })

// Updated for Rails API structure
export const fetchDistrictsByState = (stateId: string) =>
  apiClient.get(`/geography/states/${stateId}/districts`)

export const fetchBlocksByDistrict = (districtId: string) =>
  apiClient.get(`/geography/districts/${districtId}/blocks`)

// COMMENTED OUT: Old division-based districts
// export const fetchDistrictsByDivision = (divisionId: string) =>
//   axios.get(`${BASE_URL}/districts`, { params: { divisionId } })

// Additional geography endpoints
export const fetchStateDetails = (stateId: string) =>
  apiClient.get(`/geography/states/${stateId}`)

export const fetchDistrictDetails = (districtId: string) =>
  apiClient.get(`/geography/districts/${districtId}`)

export const fetchBlockDetails = (blockId: string) =>
  apiClient.get(`/geography/blocks/${blockId}`)

export const fetchFacilitiesByBlock = (blockId: string) =>
  apiClient.get(`/geography/blocks/${blockId}/health_facilities`)

// COMMENTED OUT: Sectors not available in Rails API yet
// export const fetchSectorsByBlock = (blockId: string) =>
//   axios.get(`${BASE_URL}/sectors`, { params: { blockId } })

// COMMENTED OUT: Organization endpoints (not in Rails API documentation)
// export const fetchOrgTypesByState = (stateId: string) =>
//     axios.get(`${BASE_URL}/organizationTypes`, { params: { stateId } })
  
// export const fetchOrganizationsByOrgType = (orgTypeId: string) =>
//     axios.get(`${BASE_URL}/organizations`, { params: { orgTypeId } })

// export const fetchDesignationsByOrganization = (organizationId: string) =>
//     axios.get(`${BASE_URL}/designations`, { params: { organizationId } })
  

// export const fetchDesignationsByOrgAndGeo = (
//     orgTypeId: string,
//     geoContext: {
//       stateId?: string
//       divisionId?: string
//       districtId?: string
//       blockId?: string
//       sectorId?: string
//     }
//   ) =>
//     axios.get(`${BASE_URL}/designations`, {
//       params: {
//         orgTypeId,
//         ...geoContext,
//       },
//     })
  
