import {createSlice} from "@reduxjs/toolkit";
import {themeSlice} from "./theme";

const initialState = {
    file: '',
    open: false,
}

export const fileViewerSlice = createSlice({
    name: 'file',
    initialState: initialState,
    reducers: {
        viewFile: (state, action) => {
            let {file} = action.payload;
            state.open = true;
            state.file = file;
        },
        closeFile: (state) => {
            state.open = false;
            state.file = '';
        }
    }
})

export const {viewFile, closeFile} = fileViewerSlice.actions

export const fileViewerReducer = fileViewerSlice.reducer;