import React from 'react'
import {useParams} from "react-router-dom";
import axios from "axios";
import {
    Avatar,
    Box,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar, ListItemText,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import {MoreVert} from "@mui/icons-material";

function Participants(){

    const [loading, setLoading] = React.useState(true);

    const [participants, setParticipants] = React.useState([]);

    const {id} = useParams();

    React.useEffect(()=> {
        axios.get(`/c/${id}/participants`)
            .then(res=>{
                setLoading(false);
                setParticipants(res.data);
            })
            .catch(er=>console.log(er));
    }, []);

    if(loading){
        return  <div>
            Loading...
        </div>
    }

    return (
        <div>
            <Box p={3} component={Paper}>
                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                    <Typography variant={'h5'}>Participants</Typography>
                    <Typography variant={'subtitle1'}>{participants.length}</Typography>
                </Stack>
                <Divider py={2}/>

                <Typography variant={'h5'} my={1}>
                    Teachers
                </Typography>

                <Divider />

                <List>
                    {participants.filter(item=>item.userType === 'teacher').map((participant, index) => (
                        <ListItem key={'participant' + index}
                                  secondaryAction={
                                      <IconButton edge="end" aria-label="comments">
                                          <MoreVert/>
                                      </IconButton>
                                  }
                        >
                            <ListItemAvatar>
                                <Avatar>{participant.firstName.charAt(0).toUpperCase()}</Avatar>
                            </ListItemAvatar>
                            <ListItemText primaryTypographyProps={{textTransform: 'capitalize'}}
                                          primary={participant.firstName + ' '+participant.lastName}
                            ></ListItemText>
                        </ListItem>
                    ))}
                </List>

                <Typography variant={'h5'} my={1}>Students</Typography>
                <Divider />
                <List>
                    {participants.filter(item=>item.userType === 'student').map((participant, index) => (
                        <ListItem key={'participant' + index}
                                  secondaryAction={
                                      <IconButton edge="end" aria-label="comments">
                                          <MoreVert/>
                                      </IconButton>
                                  }
                        >
                            <ListItemAvatar>
                                <Avatar>{participant.firstName.charAt(0).toUpperCase()}</Avatar>
                            </ListItemAvatar>
                            <ListItemText primaryTypographyProps={{textTransform: 'capitalize'}}
                                          primary={participant.firstName + ' '+participant.lastName}
                                          secondary={'StudentId: '+participant.studentId}
                            ></ListItemText>
                        </ListItem>
                    ))}
                </List>
            </Box>

        </div>
    )
}

export default Participants;