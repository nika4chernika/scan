import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: ''
}

export const Docs = createSlice({
   name: 'documents',
   initialState,
   reducers: {
    setDocuments: (state, action) => {
        state.value = action.payload
    }
   }
})

export const { setDocuments } = Docs.actions

export default Docs.reducer;