import React from 'react'
import {Avatar, Box, Divider, Stack, Typography} from '@mui/material'
import axios from "axios";
import {Link} from 'react-router-dom'
import {Groups as GroupIcon} from "@mui/icons-material";
import moment from "moment";
//import {socket} from "../utils/socket";

function ChatList() {

    const [loading, setLoading] = React.useState(true);
    const [chats, setChats] = React.useState([]);

    React.useEffect(() => {
        axios.get('/m')
            .then(res => {
                setLoading(false);
                setChats(res.data);
                console.log('data', res.data);
            }).catch(er => console.log(er));

    }, [])

    if (loading) {
        return <div>loading...</div>
    }

    return (
        <div>
            <Typography variant={'h4'}>Messages</Typography>

            {chats.map((chat) => (
                <Link to={`/m/${chat.id}`}>
                    <Box sx={{'&:hover': {
                        backgroundColor: '#eee'
                        }}} display={'flex'} alignItems={'center'} gap={1.5} py={1.5} my={1}>
                        <Avatar>
                            {chat.type === 'single' ? chat.receiverName.charAt(0).toUpperCase(): <GroupIcon />}
                        </Avatar>
                        <Box>
                            <Typography variant={'h5'}>{chat.name ? chat.name : chat.receiverName}</Typography>
                            <Typography>{moment(chat.lastMessageTime).fromNow()}</Typography>
                        </Box>
                    </Box>
                </Link>
            ))}

        </div>
    )
}

export default ChatList;
