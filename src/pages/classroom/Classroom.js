import React from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {
    Box,
    Button,
    Paper,
    Typography
} from "@mui/material";
import ErrorWrapper from "../../components/ErrorWrapper";
import {Link, Outlet} from 'react-router-dom'
import {fetchClassroom} from "../../store/slices/classroomSlice";
import {useDispatch, useSelector} from "react-redux";

function Classroom() {

    const dispatch = useDispatch();

    const {cls, loading, error} = useSelector(state=>state.classroom);


    let [statusCode, setStatusCode] = React.useState(null);

    let {id} = useParams();

    //fetching


    React.useEffect(() => {

        dispatch(fetchClassroom(`/c/${id}`));


    }, []);

    if (loading) {
        return <div>Loading</div>
    }


    return (
        <ErrorWrapper status={error.statusCode}>
            <Paper elevation={2} sx={{height: '200px', position: 'relative'}}>

                <Typography sx={{position: 'absolute', bottom: 5, left: 10}} variant={'h2'}>{cls.name}</Typography>

            </Paper>

            <Box>
                <Button>Posts</Button>
                <Button component={Link} to={`/c/${id}/att`}>Attendances</Button>
                <Button component={Link} to={`/c/${id}/w`}>ClassWork</Button>
                <Button component={Link} to={`/c/${id}/participants`}>Participants</Button>
            </Box>

            <Outlet />

        </ErrorWrapper>
    )

}

export default Classroom;