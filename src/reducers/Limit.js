import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: ''
}

export const Limit = createSlice({
    name: 'Limit',
    initialState,
    reducers: {
        setLimit: (state, action) => {
            state.value = action.payload
        }
    }
})

export const { setLimit } = Limit.actions

export default Limit.reducer