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
import ClassWork from "./pages/classroom/classwork/ClassWork";
import ClassWorkItem from "./pages/classroom/classwork/ClassWorkItem";
import TestPage from "./pages/test/TestPage";
import Submissions from "./pages/classroom/classwork/Submissions";
import ClassWorkDetails from "./pages/classroom/classwork/ClassWorkDetails";
import GroupList from "./pages/group/GroupList";
import Group from "./pages/group/Group";
import GroupPosts from "./pages/group/GroupPosts";
import MemberList from "./pages/group/MemberList";
import Requests from "./pages/group/Requests";
import Posts from "./pages/classroom/Posts";
import Participants from "./pages/classroom/Participants";
import About from "./pages/group/About";

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
            <ToastContainer position={"top-right"} autoClose={5000}
                            hideProgressBar={true}
            />
            <BrowserRouter>
                <Routes>
                    <Route path={'/auth/login'} element={<Login/>}/>
                    <Route path={'/test'} element={<TestPage/>}/>
                    <Route path={'/'} element={<HomeLayout/>}>
                        <Route path={'/users/:type'} element={<Users/>}/>
                        <Route path={'/courses'} element={<Courses/>}/>
                        <Route path={'/routines/:id'} element={<RoutineViewer/>}/>
                        <Route path={'/routines'} element={<Routines/>}/>
                        <Route path={'/classes'} element={<Classes/>}/>


                        <Route path={'/c/:id'} element={<Classroom/>}>
                            <Route path={'/c/:id/att'} element={<Attendances/>}/>
                            <Route path={'/c/:id/w'} element={<ClassWork/>}/>
                            <Route path={'/c/:id/participants'} element={<Participants />} />
                            <Route path={'/c/:id/w/:w'} element={<ClassWorkItem/>}>
                                <Route path={'/c/:id/w/:w'} element={<ClassWorkDetails/>}/>
                                <Route path={'/c/:id/w/:w/submissions'} element={<Submissions/>}/>
                            </Route>
                            <Route path={'/c/:id'} element={<Posts/>}/>
                        </Route>

                        {/* Group */}

                        <Route path={'/g/:id'} element={<Group/>}>
                            <Route path={'/g/:id/members'} element={<MemberList/>}/>
                            <Route path={'/g/:id/requests'} element={<Requests/>}/>
                            <Route path={'/g/:id/about'} element={<About /> } />
                            <Route path={'/g/:id'} element={<GroupPosts/>}/>
                        </Route>

                        <Route path={'/g'} element={<GroupList/>}/>

                        <Route path={'/'} element={<Dashboard/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
