import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import Cookie from "js-cookie";
import axios from "axios";

const initialState = {
    user: '',
    loading: true,
    loginMessage: '',
}

export const logout = createAsyncThunk(
    'auth/logout',
    async (ThunkAPI) => {
        let res = await axios.post('/logout');
        return res.data;
    })


export const login = createAsyncThunk(
    'auth/login',
    async (data) => {
        let res = await axios.post('/login', data);
        return res.data;
    });

export const fetchUser = createAsyncThunk(
    //action type string
    'auth/fetchUser',
    // callback function
    async (data, thunkAPI) => {
        let res = await axios.get('/user', data);
        return res.data;
    })

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchUser.pending]: (state) => {
            state.loading = true;
        },
        [fetchUser.fulfilled]: (state, {payload}) => {
            state.loading = false;
            state.user = payload.user;
        },
        [fetchUser.rejected]: (state) => {
            state.loading = false;
        },

        [logout.pending]: (state) => {

        },
        [logout.fulfilled]: (state, {payload}) => {
            state.user = '';
            Cookie.remove('loginToken');
        },
        [logout.rejected]: (state) => {

        },

        [login.pending]: (state) => {

        },
        [login.fulfilled]: (state, {payload}) => {

            let {status, token} = payload;

            if (status !== 'success') {
                state.loginMessage = "Email or password is incorrect";
            }
            if (status === 'success') {
                Cookie.set('loginToken', token, {expires: 30});
            }

        },
        [login.rejected]: (state, {payload}) => {

        },

    },
})


export const authReducer = authSlice.reducer
