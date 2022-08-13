import React from 'react'
import {
    Avatar,
    Box, Button,
    Container,
    Divider, Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar, ListItemButton, ListItemText, Paper,
    Stack,
    Typography
} from "@mui/material";
import {useParams} from "react-router-dom";
import axios from "axios";
import {MoreVert} from "@mui/icons-material";
import {toast} from "react-toastify";

function Requests() {

    const [loading, setLoading] = React.useState(true);

    const [requests, setRequests] = React.useState([]);

    const {id} = useParams();

    React.useEffect(() => {
        axios.get(`/g/${id}/requests`)
            .then(res => {
                setLoading(false);
                setRequests(res.data);
            }).catch(er => console.log(er))
    }, []);

    if (loading) {
        return <div>loading...</div>
    }

    function acceptRequest(reqId, userId) {
        axios.post(`/g/${id}/requests/${reqId}/accept`, {userId: userId})
            .then(res => {
                let {status} = res.data;
                if (status === 'success') {
                    toast.success('Request Accepted');
                    setRequests(prev => prev.filter(item => item.id !== userId));
                }
            }).catch(er => {
            let {status, message} = er.response;
            toast.warn(message);
            console.log(er)
        })
    }

    const removeRequest = (reqId) => {
        axios.delete(`/g/${id}/requests/${reqId}`)
            .then(res => {
                let {status} = res.data;
                if (status === 'success') {
                    setRequests(prev => prev.filter(item => item.requestId !== reqId));
                }
            }).catch(er => console.log(er))
    }

    return (
        <Container>
            <Stack py={2} direction={'row'} alignItems={'center'} spacing={2}>
                <Typography variant={'h5'}>Requests</Typography>
                <Typography variant={'subtitle1'}>{requests.length}</Typography>
            </Stack>
            <Divider py={2}/>

            <Grid container spacing={2}>

                {requests.map((request) => (
                    <Grid key={'request'+request.id} item xs={12} md={6}>
                        <Stack py={2} direction={'row'} alignItems={'center'} spacing={2}>

                            <Avatar sx={{
                                width: '50px',
                                height: '50px',
                                fontSize: '1.5rem'
                            }}>{request.fullName.charAt(0).toUpperCase()}</Avatar>

                            <Stack>
                                <Typography my={1} textTransform={'capitalize'}
                                            variant={'h5'}>{request.fullName}</Typography>
                                <Stack direction={'row'} alignItems={'center'} spacing={1}>
                                    <Button onClick={() => acceptRequest(request.requestId, request.id)}
                                            variant={'contained'}>Accept</Button>
                                    <Button onClick={() => removeRequest(request.requestId)} variant={'contained'}
                                            color={'error'}>Delete</Button>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Grid>
                ))}
            </Grid>

        </Container>
    )
}

export default Requests;