import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: ''
}

export const Histograms = createSlice({
    name: 'histograms',
    initialState,
    reducers: {
     setHistograms: (state, action) => {
        state.value = action.payload
     }
    }
 })
 
export const { setHistograms } = Histograms.actions
 
export default Histograms.reducer;