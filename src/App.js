import './App.css';
import './main.css'
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/auth/Login";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import Cookie from "js-cookie";
import {fetchUser} from "./store/slices/auth";
import {CircularProgress, CssBaseline, ThemeProvider} from "@mui/material";
import theme from "./themes";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeLayout from "./layouts/HomeLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Courses from "./pages/Courses";
import Routines from "./pages/routine/Routines";
import RoutineViewer from "./pages/routine/RoutineViewer";
import Classes from "./pages/classroom/Classes";
import Classroom from "./pages/classroom/Classroom";
import Attendances from "./pages/Attendances";
import ClassWork from "./pages/classroom/ClassWork";
import ClassWorkItem from "./pages/classroom/ClassWorkItem";

function App() {

    axios.defaults.baseURL = 'http://localhost:5000/api/v1/';
    axios.defaults.headers['accept'] = 'application/json';

    //let login token

    let loginToken = Cookie.get('loginToken');

    let {loading} = useSelector(state => state.auth);

    //theme

    let themes = theme();

    let dispatch = useDispatch();

    React.useEffect(() => {

        axios.defaults.headers['authorization'] = 'Bearer ' + loginToken;

        if (loginToken) {
            dispatch(fetchUser());
        }
    }, []);

    if (loading && loginToken) {
        return <CircularProgress/>
    }

    return (
        <ThemeProvider theme={themes}>
            <CssBaseline/>
            <ToastContainer position={"top-left"} autoClose={5000}
                            hideProgressBar={true}
            />
            <BrowserRouter>
                <Routes>
                    <Route path={'/auth/login'} element={<Login/>}/>
                    <Route path={'/'} element={<HomeLayout/>}>
                        <Route path={'/users/:type'} element={<Users/>}/>
                        <Route path={'/courses'} element={<Courses/>}/>
                        <Route path={'/routines/:id'} element={<RoutineViewer/>}/>
                        <Route path={'/routines'} element={<Routines/>}/>
                        <Route path={'/classes'} element={<Classes/>} />
                        <Route path={'/c/:id/att'} element={<Attendances /> } />
                        <Route path={'/c/:id/w/:w'} element={<ClassWorkItem /> } />
                        <Route path={'/c/:id/w'} element={<ClassWork /> } />
                        <Route path={'/c/:id'} element={<Classroom />} />
                        <Route path={'/'} element={<Dashboard/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
