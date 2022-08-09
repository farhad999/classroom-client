import {configureStore} from '@reduxjs/toolkit'
import {authReducer} from "./slices/auth";
import {themeReducer,} from "./slices/theme";
import {fileViewerReducer} from "./slices/fileViewer";
import {classroomReducer} from "./slices/classroomSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        fileViewer: fileViewerReducer,
        classroom: classroomReducer,
    },
})

export default store;