import { createSlice } from "@reduxjs/toolkit/src";
// import { formDataType } from "../../components";

export interface formDataType {
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    role: string;
    dateOfJoining: string;
    address: string;
    contactNo: string;
    city: string;
    state: string;
    postalCode: string;
    photoURL:string
  }
interface formDataTypeWithId extends formDataType{
    id:string
  }
interface initialStateType{
    employeeData:formDataTypeWithId[]
}
const initialState:initialStateType = {
    employeeData:[]
}

export const employeeSlice = createSlice({
    name:"EmployeeSlice",
    initialState,
    reducers:{
        update:(state,action)=>{
            state.employeeData = action.payload;
            console.log('action.payload: ', action.payload)
        }
    }
})

export const {update} = employeeSlice.actions
export default employeeSlice.reducer