import logo from './logo.svg';
import './App.css';
import './main.css'
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import Cookie from "js-cookie";
import {fetchUser} from "./store/slices/auth";
import {CssBaseline, ThemeProvider} from "@mui/material";
import theme from "./themes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {

    axios.defaults.baseURL = 'http://localhost:5000/api/v1/';
    axios.defaults.headers['accept'] = 'application/json';
    axios.defaults.headers['authorization'] = 'Bearer ' + Cookie.get('loginToken');

    let {loading} = useSelector(state => state.auth);

    //theme

    let themes = theme();

    let dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(fetchUser());
    }, []);

    if (loading) {
        return <p>loading</p>
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
                    <Route path={'/'} element={<Home/>}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
