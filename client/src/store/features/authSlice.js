import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isLoggedIn:false,
    user:null,
    loading:true
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        loginSuccess:(state,action)=>{
            state.isLoggedIn = true;
            state.user = action.payload;
            state.loading = false;
        },
        logout:(state,action)=>{
            state.isLoggedIn = false;
            state.user = null;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        updateUserData:(state, action)=>{
            state.user = action.payload;
        }
    }
})

export const { loginSuccess, logout, setLoading, updateUserData} = authSlice.actions;
export default authSlice.reducer;