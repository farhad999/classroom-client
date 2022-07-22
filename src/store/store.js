import {configureStore} from '@reduxjs/toolkit'
import {authReducer} from "./slices/auth";
import {themeReducer,} from "./slices/theme";
import {fileViewerReducer} from "./slices/fileViewer";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        fileViewer: fileViewerReducer,
    },
})

export default store;