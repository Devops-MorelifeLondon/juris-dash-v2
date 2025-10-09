import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AttorneyState {
  fullName: string;
  email: string;
}

const initialState: AttorneyState = {
  fullName: '',
  email: '',
};

const attorneySlice = createSlice({
  name: 'attorney',
  initialState,
  reducers: {
    setAttorney: (state, action: PayloadAction<AttorneyState>) => {
      state.fullName = action.payload.fullName;
      state.email = action.payload.email;
    },
    clearAttorney: (state) => {
      state.fullName = '';
      state.email = '';
    },
  },
});

export const { setAttorney, clearAttorney } = attorneySlice.actions;
export default attorneySlice.reducer;
