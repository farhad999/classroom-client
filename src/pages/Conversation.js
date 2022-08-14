import React from 'react'
import {Box, Container, Divider, IconButton, Skeleton, Stack, TextField, Typography} from "@mui/material";
import {ArrowBack, ArrowForward, ArrowRight, MoreHoriz, Send} from "@mui/icons-material";
import axios from "axios";
import {useParams} from "react-router-dom";
import MessageBubble from "../components/MessageBubble";
import {useSelector} from "react-redux";
import {nanoid} from "nanoid";
import moment from 'moment'

function Conversation() {

    const {id} = useParams();

    const {user} = useSelector(state => state.auth);

    const [typedMessage, setTypedMessage] = React.useState("");

    const [conversation, setConversation] = React.useState(null);

    const [messages, setMessages] = React.useState([]);

    const [messagePage, setMessagePage] = React.useState(1);

    const [loading, setLoading] = React.useState(true);

    const endBubbleRef = React.useRef(null);

    const sendMessage = () => {

        let message = {
            body: typedMessage,
            id: nanoid(10),
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        };

        setMessages(prev => [...prev, {...message, senderId: user.id}]);

        setTypedMessage("");

        axios.post(`/m/${id}`, message)
            .then(res => {
                let {status} = res.data;
                if (status === 'success') {

                }
            }).catch(er => console.log(er))
    }

    React.useEffect(() => {

        axios.get(`/m/${id}?page${messagePage}`)
            .then(res => {
                let {conversation, messages} = res.data;
                setLoading(false);
                setConversation(conversation);
                setMessages(messages.data);
                scrollToBottom();

            }).catch(er => console.log(er));

    }, []);

    const scrollToBottom = () => {
        console.log('scroll');
        endBubbleRef.current.scrollIntoView({behavior: "smooth"});
    };

    React.useEffect(scrollToBottom, [messages]);

    function detectKey(event) {
        if (event.keyCode === 13) {
            sendMessage();

        }
    }

    return (


        <Box sx={{display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px);'}}>


            <Box sx={{flex: '0 0 auto'}}>
                <Stack py={1} direction={'row'} justifyContent={'space-between'}
                       alignItems={'center'}
                >
                    <IconButton>
                        <ArrowBack/>
                    </IconButton>
                    {loading ?
                        <Skeleton variant={'rectangular'} sx={{width: '40%', height: '20px'}}/>
                        :
                        <Typography variant={'h4'}>{conversation.name}</Typography>
                    }

                    <IconButton>
                        <MoreHoriz/>
                    </IconButton>
                </Stack>

                <Divider/>
            </Box>


            <Box sx={{flex: '1 1 auto', position: 'relative', overflowY: 'auto'}}>
                {messages.map((message, index) => (
                    <MessageBubble
                        isSent={user.id === message.senderId}
                        message={message}/>

                ))}
                <Box ref={endBubbleRef}></Box>
            </Box>




            <Stack direction={'row'} alignItems={'center'} sx={{flex: '0 0 auto'}}>
                <TextField label={'Type a message'}
                           onKeyDown={detectKey}
                           value={typedMessage}
                           fullWidth={true}
                           onChange={(event) => setTypedMessage(event.target.value)}
                />
                <IconButton onClick={sendMessage} disabled={!typedMessage.length}>
                    <Send/>
                </IconButton>
            </Stack>
        </Box>


    )

}

export default Conversation;