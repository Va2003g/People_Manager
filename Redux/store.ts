import { configureStore } from "@reduxjs/toolkit";
import UserData from './UserDataSlice'
import booleanSlice from "./booleanSlice";
import ProjectSlice from "./projectSlice";
export const store = configureStore({
  reducer: {
    userData: UserData,
    booleanData:booleanSlice,
    projectData:ProjectSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
