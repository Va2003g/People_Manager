import { createSlice } from "@reduxjs/toolkit/src";
// export interface userDataType {
//     displayName:string,
//     email:string,
//     photoURL:string,
// }
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
  photoURL: string;
  [key:string]:string;
}
interface UserState {
  data: formDataType;
  id:string,
}
const initialState: UserState = {
  data: {
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    role: "",
    dateOfJoining: "",
    address: "",
    contactNo: "",
    city: "",
    state: "",
    postalCode: "",
    photoURL: "",
  },
  id:'',
}

export const userSlice = createSlice({
  name: "UserData",
  initialState,
  reducers: {
    update: (state, action) => {
      state.data = action.payload;
      console.log('action.payload: ', action.payload)
    },
    updateId: (state, action) => {
      state.id = action.payload;
      console.log('action.payload: ', action.payload)
    },
    updateUserData:(state,action)=>{
      console.log(action)
    }
  },
});

export const { update,updateId,updateUserData } = userSlice.actions;
export default userSlice.reducer;
