import { createSlice } from "@reduxjs/toolkit";

const AuthSlice=createSlice({
    name:"auth",
    initialState:{user:null,accessToken:null,isAuthenticated:false},
    reducers:{
        loginSuccess:(state,action)=>{
            state.user=action.payload.user;
            state.accessToken=action.payload.accessToken;
            state.isAuthenticated=true;
        },
        logout:(state)=>{
            state.user=null;
            state.accessToken=null;
            state.isAuthenticated=false;
        }
    }
})

export const {loginSuccess,logout}=AuthSlice.actions;
export default AuthSlice.reducer;