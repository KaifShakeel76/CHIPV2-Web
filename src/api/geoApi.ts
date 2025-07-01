import axios from "axios"

const BASE_URL = "http://localhost:3001"

export const fetchStates = () => axios.get(`${BASE_URL}/states`)

export const fetchDivisionsByState = (stateId: string) =>
  axios.get(`${BASE_URL}/divisions`, { params: { stateId } })

export const fetchDistrictsByDivision = (divisionId: string) =>
  axios.get(`${BASE_URL}/districts`, { params: { divisionId } })

export const fetchBlocksByDistrict = (districtId: string) =>
  axios.get(`${BASE_URL}/blocks`, { params: { districtId } })

export const fetchSectorsByBlock = (blockId: string) =>
  axios.get(`${BASE_URL}/sectors`, { params: { blockId } })


export const fetchOrgTypesByState = (stateId: string) =>
    axios.get(`${BASE_URL}/organizationTypes`, { params: { stateId } })
  
  export const fetchOrganizationsByOrgType = (orgTypeId: string) =>
    axios.get(`${BASE_URL}/organizations`, { params: { orgTypeId } })

export const fetchDesignationsByOrganization = (organizationId: string) =>
    axios.get(`${BASE_URL}/designations`, { params: { organizationId } })
  

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
  
