import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: true,
    group: '',
    accessInfo: '',
    error: {},
}

export const fetchGroup = createAsyncThunk(
    //action type string
    'group/fetch',
    // callback function
    async (url, {rejectWithValue}) => {

        try {
            let res = await axios.get(url);
            return res.data;
        } catch (er) {

            let {status} = er.response;

            return rejectWithValue({statusCode: status})
        }
    })

export const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchGroup.pending]: (state) => {
            state.loading = true;
        },
        [fetchGroup.fulfilled]: (state, {payload}) => {
            state.loading = false;
            state.group = payload.group;
            state.accessInfo = payload.accessInfo;
        },
        [fetchGroup.rejected]: (state, {payload}) => {
            state.loading = false;
            state.error = {...payload}
        },

    },
})


export const groupReducer = groupSlice.reducer;