import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StateState {
  selectedState: string | null;
}

const initialState: StateState = {
  selectedState: null,
};

const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    setSelectedState: (state, action: PayloadAction<string>) => {
      state.selectedState = action.payload;
    },
    clearSelectedState: (state) => {
      state.selectedState = null;
    },
  },
});

export const { setSelectedState, clearSelectedState } = stateSlice.actions;
export default stateSlice.reducer;