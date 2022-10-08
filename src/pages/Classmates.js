import React from 'react'
import axios from "axios";
import {Avatar, Box, Card, CardContent, Grid, IconButton, Typography} from "@mui/material";
import {Message as MessageIcon, MoreHoriz} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

function Classmates() {

    const [mates, setMates] = React.useState([]);

    const navigate = useNavigate();

    React.useEffect(() => {
        axios.get('/mates')
            .then(res => {
                setMates(res.data)
            })
    }, []);

    const startMessaging = (id) => {
        axios.post(`/m/start`, {receiverId: id})
            .then(res=>{
                let {status, conversationId} = res.data;
                if(status === 'success'){
                    navigate(`/m/${conversationId}`)
                }
            })
    }

    return (
        <>
            <Box my={3}>
                <Typography variant={'h4'}>Classmates</Typography>
            </Box>
            <Grid container={true} spacing={2}>
                {
                    mates.map((mate, index) => (
                        <Grid key={index} lg={4} sm={6} xs={12} item>
                            <Card>
                                <CardContent>
                                    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                                        <Box display={'flex'} alignItems={'center'} gap={1.5}>
                                            <Avatar sx={{height: 64, width: 64, borderRadius: '5px'}}
                                                    variant={'square'}>
                                                {mate.firstName.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Box>
                                                <Typography>{mate.firstName + ' ' + mate.lastName}</Typography>
                                            </Box>
                                        </Box>
                                        <IconButton onClick={()=>startMessaging(mate.id)}>
                                            <MessageIcon/>
                                        </IconButton>
                                    </Box>

                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>

        </>
    )
}

export default Classmates;
