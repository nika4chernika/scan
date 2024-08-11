import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: ''
}

export const AccessToken = createSlice({
   name: 'accessToken',
   initialState,
   reducers: {
    setAccessToken: (state, action) => {
        state.value = action.payload
    }
   }
})

export const { setAccessToken } = AccessToken.actions

export default AccessToken.reducer;