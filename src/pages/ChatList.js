import React from 'react'
import {Divider, Stack, Typography} from '@mui/material'
import axios from "axios";
import {Link} from 'react-router-dom'
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
            <Typography>Messages</Typography>

            {chats.map((chat) => (
                <Link to={`/m/${chat.id}`}>
                    {chat.name}
                </Link>
            ))}

        </div>
    )
}

export default ChatList;