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
                        <Route path={'/'} element={<Dashboard/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
