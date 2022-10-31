import { createSlice } from "@reduxjs/toolkit";

export const userModalSlice = createSlice({
  name: "userModal",
  initialState: {
    value: false,
  },
  reducers: {
    setUserModalData: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserModalData } = userModalSlice.actions;

export default userModalSlice.reducer;
