import React from 'react'
import axios from "axios";
import {useParams} from "react-router-dom";
import {
    Avatar,
    Box,
    Divider, IconButton,
    List,
    ListItem,
    ListItemAvatar, ListItemButton, ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import {MoreVert} from "@mui/icons-material";

function MemberList() {

    const {id} = useParams();

    const [loading, setLoading] = React.useState(true);

    const [members, setMembers] = React.useState([]);

    React.useEffect(() => {
        axios.get(`/g/${id}/members`)
            .then(res => {
                setLoading(false);
                setMembers(res.data);
            }).catch(er => console.log(er));
    }, []);

    if (loading) {
        return <div>loading...</div>
    }

    return (
        <div>
            <Box p={3} component={Paper}>
                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                    <Typography variant={'h5'}>Members</Typography>
                    <Typography variant={'subtitle1'}>{members.length}</Typography>
                </Stack>
                <Divider py={2}/>
                <List>
                    {members.map((member, index) => (
                        <ListItem key={'member' + index}
                                  secondaryAction={
                                      <IconButton edge="end" aria-label="comments">
                                          <MoreVert/>
                                      </IconButton>
                                  }
                        >
                            <ListItemAvatar>
                                <Avatar>{member.fullName.charAt(0).toUpperCase()}</Avatar>
                            </ListItemAvatar>
                            <ListItemText primaryTypographyProps={{textTransform: 'capitalize'}}
                                          primary={member.fullName}></ListItemText>
                        </ListItem>
                    ))}
                </List>
            </Box>

        </div>
    )
}

export default MemberList;