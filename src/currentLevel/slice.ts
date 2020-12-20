import { createSlice } from "@reduxjs/toolkit";

export const { actions, reducer } = createSlice({
  name: "currentLevel",
  initialState: {
    isCompleted: false,
  },
  reducers: {
    winLevel: (state) => ({ ...state, isCompleted: true }),
  },
});
