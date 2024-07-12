import { createSlice } from "@reduxjs/toolkit/src";

interface BooleanState{
    [key:string]:boolean
}

const initialState:BooleanState={
    showEmployeeForm:false,
    showEmployees:false,
}

export const booleanSlice = createSlice({
    name:'booleanSlice',
    initialState,
    reducers:{
        setTrue:(state,action)=>{
            state[action.payload] = true
        },
        setFalse:(state,action)=>{
            state[action.payload] = false
        },
        toggle:(state,action)=>{
            state[action.payload] = !state[action.payload]
        }
    }
})

export const {setTrue,setFalse,toggle} = booleanSlice.actions;
export default booleanSlice.reducer;
