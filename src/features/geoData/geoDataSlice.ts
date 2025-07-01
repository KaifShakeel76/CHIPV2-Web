/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import * as geoApi from "@/api/geoApi"

interface GeoState {
  states: any[]
  divisions: any[]
  districts: any[]
  blocks: any[]
  sectors: any[]
  orgTypes: any[]
  organizations: any[]
  designations: any[]
  loading: boolean
  error: string | null
}

const initialState: GeoState = {
  states: [],
  divisions: [],
  districts: [],
  blocks: [],
  sectors: [],
  orgTypes: [],
  organizations: [],
  designations: [],
  loading: false,
  error: null
}

// Async thunks
export const loadStates = createAsyncThunk("geo/loadStates", async () => (await geoApi.fetchStates()).data)
export const loadDivisions = createAsyncThunk("geo/loadDivisions", async (stateId: string) => (await geoApi.fetchDivisionsByState(stateId)).data)
export const loadDistricts = createAsyncThunk("geo/loadDistricts", async (divisionId: string) => (await geoApi.fetchDistrictsByDivision(divisionId)).data)
export const loadBlocks = createAsyncThunk("geo/loadBlocks", async (districtId: string) => (await geoApi.fetchBlocksByDistrict(districtId)).data)
export const loadSectors = createAsyncThunk("geo/loadSectors", async (blockId: string) => (await geoApi.fetchSectorsByBlock(blockId)).data)
export const loadOrgTypesByState = createAsyncThunk(
    "geo/loadOrgTypesByState",
    async (stateId: string) => (await geoApi.fetchOrgTypesByState(stateId)).data
  )
  
  export const loadOrganizations = createAsyncThunk(
    "geo/loadOrganizations",
    async (orgTypeId: string) => (await geoApi.fetchOrganizationsByOrgType(orgTypeId)).data
  )
  
export const loadDesignations = createAsyncThunk(
    "geo/loadDesignations",
    async ({ organizationId }: { organizationId: string }) => {
      return (await geoApi.fetchDesignationsByOrganization(organizationId)).data
    }
  )
  
  

const geoDataSlice = createSlice({
  name: "geoData",
  initialState,
  reducers: {
    resetGeoData: (state, action: PayloadAction<string>) => {
      const resetMap: Record<string, (keyof GeoState)[]> = {
        state: ["divisions", "districts", "blocks", "sectors", "orgTypes", "organizations", "designations"],
        division: ["districts", "blocks", "sectors"],
        district: ["blocks","sectors"],
        block: ["sectors"],
        sector: [],
        organizationType: ["organizations", "designations"],
        organization: ["designations"]
      }

      const keysToReset = resetMap[action.payload] || []
      keysToReset.forEach((key) => {
        (state[key] as any[]) = []
      })
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadStates.fulfilled, (state, action) => {
        state.states = action.payload
        state.loading = false
      })
      .addCase(loadDivisions.fulfilled, (state, action) => {
        state.divisions = action.payload
        state.loading = false
      })
      .addCase(loadDistricts.fulfilled, (state, action) => {
        state.districts = action.payload
        state.loading = false
      })
      .addCase(loadBlocks.fulfilled, (state, action) => {
        state.blocks = action.payload
        state.loading = false
      })
      .addCase(loadSectors.fulfilled, (state, action) => {
        state.sectors = action.payload
        state.loading = false
      })
      .addCase(loadOrgTypesByState.fulfilled, (state, action) => {
        state.orgTypes = action.payload
        state.loading = false
      })
      
      .addCase(loadOrganizations.fulfilled, (state, action) => {
        state.organizations = action.payload
        state.loading = false
      })
      .addCase(loadDesignations.fulfilled, (state, action) => {
        state.designations = action.payload
        state.loading = false
      })
      .addMatcher((action) => action.type.endsWith("/pending"), (state) => {
        state.loading = true
        state.error = null
      })
      .addMatcher((action): action is ReturnType<typeof loadStates.rejected> => action.type.endsWith("/rejected"), (state, action) => {
        state.loading = false
        state.error = action.error?.message || "Something went wrong"
      })
  }
})

export const { resetGeoData } = geoDataSlice.actions
export default geoDataSlice.reducer