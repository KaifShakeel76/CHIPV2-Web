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
  withCredentials: true,
})

// Organization Level APIs
export const fetchOrganizationLevels = () =>
  apiClient.get('/organization_levels')

// Organization Type APIs
export const fetchOrganizationTypes = () =>
  apiClient.get('/organization_types')

// Organization APIs
export const fetchAllOrganizations = () =>
  apiClient.get('/organizations')

export const fetchOrganizationsByType = (organizationTypeId: string) =>
  apiClient.get(`/organizations?organization_type_id=${organizationTypeId}`)

// Organization Designation APIs
export const fetchAllDesignations = () =>
  apiClient.get('/organization_designations')

export const fetchDesignationsByOrgLevelAndOrg = (
  organizationLevelId: string,
  organizationId: string
) =>
  apiClient.get(`/organization_designations?organization_level_id=${organizationLevelId}&organization_id=${organizationId}`)