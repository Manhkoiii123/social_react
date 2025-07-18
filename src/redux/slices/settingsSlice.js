import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isShowDrawer: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleDrawer: (state) => {
      state.isShowDrawer = !state.isShowDrawer;
    },
    // action creator => function ||| action { type, payload } => openSnackbar({message: 'Good job'}) => action { type: 'snackbar/openSnackbar', payload: {message: 'Good job'}}
  },
});

export const { toggleDrawer } = settingsSlice.actions;
export default settingsSlice.reducer;
