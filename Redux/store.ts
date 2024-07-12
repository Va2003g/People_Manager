import { configureStore } from "@reduxjs/toolkit";
import UserData from './UserDataSlice'
import booleanSlice from "./booleanSlice";
import EmployeeSlice from "./EmployeeSlice";
import ProjectSlice from "./projectSlice";
export const store = configureStore({
  reducer: {
    userData: UserData,
    booleanData:booleanSlice,
    employeeData:EmployeeSlice,
    projectData:ProjectSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
