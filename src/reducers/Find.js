import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: ''
}

export const Find = createSlice({
    name: 'Find',
    initialState,
    reducers: {
     setFind: (state, action) => {
        state.value = action.payload
     }
    }
 })
 
export const { setFind } = Find.actions
 
export default Find.reducer;