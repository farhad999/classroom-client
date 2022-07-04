import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    selectedMenu: "",
};

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        openMenu: (state, action) => {
            let {id} = action.payload;
            state.selectedMenu = id;

        },
        closeMenu: (state) => {
            state.selectedMenus = null;
        }
    },

});

export const {openMenu, closeMenu} = themeSlice.actions

export const themeReducer = themeSlice.reducer;