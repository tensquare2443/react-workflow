import { createSlice } from "@reduxjs/toolkit";

export const issueModalSlice = createSlice({
  name: "issueModal",
  initialState: {
    value: false,
  },
  reducers: {
    setIssueModalData: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setIssueModalData } = issueModalSlice.actions;

export default issueModalSlice.reducer;
