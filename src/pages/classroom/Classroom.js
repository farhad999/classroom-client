import React from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    FormControl,
    OutlinedInput,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import ErrorWrapper from "../../components/ErrorWrapper";

function Classroom() {

    let [cls, setCls] = React.useState(null);

    let [loading, setLoading] = React.useState(true);

    let {id} = useParams();

    React.useEffect(() => {
        axios.get('/c/' + id)
            .then(res => {
                setCls(res.data);
                setLoading(false);
            }).catch(er => console.log(er));
    }, []);

    if (loading) {
        return <div>Loading</div>
    }

    return (
        <ErrorWrapper status={401}>
            <Paper elevation={2} sx={{height: '25vh', position: 'relative'}}>

                <Typography sx={{position: 'absolute', bottom: 5, left: 10}} variant={'h2'}>{cls.name}</Typography>

            </Paper>

            {/*<Box>
                <Button>Posts</Button>
                <Button>Chats</Button>
                <Button>Attendences</Button>
            </Box>*/}

            <Card sx={{my: 1}}>
                <CardContent>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Multiline"
                        multiline
                        maxRows={4}
                    />

                    <Button>Post</Button>

                </CardContent>

            </Card>

        </ErrorWrapper>
    )

}

export default Classroom;