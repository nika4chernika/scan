import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: ''
}

export const DocList = createSlice({
    name: 'DocList',
    initialState,
    reducers: {
        setDocList: (state, action) => {
            state.value = action.payload
        }
    }
})

export const { setDocList } = DocList.actions

export default DocList.reducer