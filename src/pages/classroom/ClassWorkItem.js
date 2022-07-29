import React from 'react'
import {useParams} from "react-router-dom";
import axios from "axios";
import {Avatar, Box, Button, Card, CardContent, Divider, Grid, Stack, Typography} from "@mui/material";

function ClassWorkItem(){

    let {id, w} = useParams();

    const [assignment, setAssignment] = React.useState(null);

    const [loading, setLoading] = React.useState(true);

    React.useEffect(()=> {
        axios.get(`/c/${id}/assignments/${w}`)
            .then(res=>{
                setAssignment(res.data);
                setLoading(false);
                console.log("res", res);
            }).catch(er=>console.log(er))
    }, []);


    if(loading){
        return <div>
            Loading...
        </div>
    }

    return(
        <div>
            <Grid container>
                <Grid item sm={8}>
                    <Box>
                        <Typography>{assignment.title}</Typography>
                        <Stack my={2} direction={'row'} gap={2} alignItems={'center'}>
                            <Avatar>F</Avatar>
                            <Typography>{assignment.firstName+ ' '+assignment.lastName}</Typography>
                        </Stack>
                        <Typography>Points : {assignment.points}</Typography>
                        <Divider />
                        <Typography>{assignment.description}</Typography>
                    </Box>
                </Grid>
                <Grid item sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant={'h4'}>Your Work</Typography>
                            <Button sx={{my: 2}} variant={'outlined'} fullWidth={true}>Attach File</Button>
                            <Button variant={'contained'} fullWidth={true}>Submit</Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    )
}

export default ClassWorkItem;