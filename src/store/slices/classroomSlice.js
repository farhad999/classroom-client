import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: true,
    cls: '',
    user: '',
    error: {},
}

export const fetchClassroom = createAsyncThunk(
    //action type string
    'classroom/fetch',
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

export const classroomSlice = createSlice({
    name: 'classroom',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchClassroom.pending]: (state) => {
            state.loading = true;
        },
        [fetchClassroom.fulfilled]: (state, {payload}) => {
            state.loading = false;
            state.cls = payload.cls;
            state.user = payload.user;
        },
        [fetchClassroom.rejected]: (state, {payload}) => {
            state.loading = false;
            state.error = {...payload}
        },

    },
})


export const classroomReducer = classroomSlice.reducer;