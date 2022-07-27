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
import Posts from "./Posts";
import {Link} from 'react-router-dom'

function Classroom() {

    let [cls, setCls] = React.useState(null);

    let [loading, setLoading] = React.useState(true);

    let [statusCode, setStatusCode] = React.useState(null);

    let {id} = useParams();

    //fetching


    React.useEffect(() => {

        (async () => {
            try {
                setLoading(true)
                const res = await axios.get(`/c/${id}`);
                setCls(res.data);
                setLoading(false);
            } catch (er) {
                console.log('er', er);
                setLoading(false);
            }
        })();


    }, []);

    if (loading) {
        return <div>Loading</div>
    }


    return (
        <ErrorWrapper status={statusCode}>
            <Paper elevation={2} sx={{height: '200px', position: 'relative'}}>

                <Typography sx={{position: 'absolute', bottom: 5, left: 10}} variant={'h2'}>{cls.name}</Typography>

            </Paper>

            <Box>
                <Button>Posts</Button>
                <Button>Chats</Button>
                <Button component={Link} to={'att'}>Attendances</Button>
            </Box>

            <Posts/>


        </ErrorWrapper>
    )

}

export default Classroom;