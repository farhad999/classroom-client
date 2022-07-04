import {configureStore} from '@reduxjs/toolkit'
import {authReducer} from "./slices/auth";
import {themeReducer,} from "./slices/theme";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
    },
})

export default store;