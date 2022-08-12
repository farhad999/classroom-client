import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: true,
    group: '',
    accessInfo: {
        loading: false,
        error: {},
    },
    error: {},
}

export const sendOrCancelJoinRequest = createAsyncThunk(
    'group/join',
    async (url, {rejectWithValue}) => {
        try {
            let res = await axios.post(url);
            return res.data;
        } catch (er) {
            let {status} = er.response;

            return rejectWithValue({statusCode: status})
        }
    });

export const acceptInvite = createAsyncThunk(
    'group/acceptInvite',
    async (url, {rejectWithValue}) => {
        try {
            let res = await axios.post(url);
            return res.data;
        } catch (er) {
            let {status} = er.response;

            return rejectWithValue({statusCode: status})
        }
    });

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
            state.accessInfo = {...state.accessInfo, ...payload.accessInfo};
        },
        [fetchGroup.rejected]: (state, {payload}) => {
            state.loading = false;
            state.error = {...payload}
        },
        [sendOrCancelJoinRequest.pending]: (state) => {
            state.accessInfo.loading = true;
        },
        [sendOrCancelJoinRequest.fulfilled]: (state, {payload}) => {
            state.accessInfo.loading = false;
            const {accessInfo} = payload;
           // state.accessInfo.isRequestSent = isRequestSent;

            state.accessInfo = {...state.accessInfo, ...accessInfo};

            console.log('payload', payload);
        },
        [sendOrCancelJoinRequest.rejected]: (state) => {

        },


    },
})


export const groupReducer = groupSlice.reducer;