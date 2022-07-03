import React from "react";
import {logout} from "../store/slices/auth";
import {useDispatch, useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import axios from "axios";
import Cookie from "js-cookie";


function Home() {

    let {user} = useSelector(state => state.auth);

    let dispatch = useDispatch();

    const doLogout = () => {
        dispatch(logout());
    }

    if (!user) {
        return <Navigate to={'/auth/login'}/>
    }

    return (
        <div>
            Home page

            <button className={'py-2 px-5 bg-blue-300'} onClick={doLogout}>Logout</button>

        </div>
    )
}

export default Home;