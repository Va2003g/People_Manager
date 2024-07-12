import { createSlice } from "@reduxjs/toolkit/src";

// interface formDataTypeWithId extends formDataType{
//     id:string
// }
export interface ProjectData {
    title: string;
    description: string;
    employeeId: string;
    startDate: string;
    endDate: string;
  }
interface initialStateType{
    projectData:ProjectData[]
}
const initialState:initialStateType = {
    projectData:[]
}

export const projectSlice = createSlice({
    name:"ProjectSlice",
    initialState,
    reducers:{
        update:(state,action)=>{
            state.projectData.push(action.payload);
            console.log('action.payload: ', action.payload)
        },
        updateNewProject:(state,action)=>{
            state.projectData = action.payload
        }
    }
})

export const {update,updateNewProject} = projectSlice.actions
export default projectSlice.reducer