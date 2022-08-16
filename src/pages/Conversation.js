import React from 'react'
import {
    Box, Container, Divider, IconButton,
    Skeleton, Stack, TextField, Typography,
    CircularProgress
} from "@mui/material";
import {ArrowBack, ArrowForward, ArrowRight, MoreHoriz, Send} from "@mui/icons-material";
import axios from "axios";
import {useParams} from "react-router-dom";
import MessageBubble from "../components/MessageBubble";
import {useSelector} from "react-redux";
import {nanoid} from "nanoid";
import moment from 'moment'
import InfiniteScroll from "react-infinite-scroll-component";
import {io} from "socket.io-client";



function Conversation() {

    const {id} = useParams();

    const {user} = useSelector(state => state.auth);

    const [typedMessage, setTypedMessage] = React.useState("");

    const [conversationDetails, setConversationDetails] = React.useState(null);

    const [messages, setMessages] = React.useState([]);

    //const [messagePage, setMessagePage] = React.useState(null);

    const [paginationData, setPaginationData] = React.useState(null);

    const [loading, setLoading] = React.useState(true);

    const endBubbleRef = React.useRef(null);

    const sendMessage = () => {

        let message = {
            body: typedMessage,
            id: nanoid(10),
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        };

        setMessages(prev => [{...message, senderId: user.id}, ...prev]);

        setTypedMessage("");

        axios.post(`/m/${id}`, message)
            .then(res => {
                let {status} = res.data;
                if (status === 'success') {
                  //  socket.emit('sendMessage', {message: {...message, senderId: user.id}});
                    console.log('message sent');
                }
            }).catch(er => console.log(er))
    }

    const fetchMessage = (data) => {

        console.log('nxt', data);

        let page;

        if (!paginationData) {
            page = 1;
        } else {
            page = paginationData.currentPage + 1;
        }

        axios.get(`/m/${id}?page=${page}`)
            .then(res => {
                let {conversation, messageData} = res.data;
                setLoading(false);

                if (!conversationDetails) {
                    setConversationDetails(conversation);
                }
                setMessages([...messages, ...messageData.data]);
                setPaginationData(messageData.pagination);

            }).catch(er => console.log(er));
    }

    React.useEffect(() => {
        fetchMessage();

        /*socket.connect();

        socket.emit('message', {conversationId: id},  ()=> {

        });

        socket.on('broadcastMessage', (data)=> {
            console.log('data', data);
        })*/

        /*return ()=> {
            socket.off('broadcastMessage');
        }*/

    }, []);

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
                        <Typography variant={'h4'}>{conversationDetails.name}</Typography>
                    }

                    <IconButton>
                        <MoreHoriz/>
                    </IconButton>
                </Stack>

                <Divider/>
            </Box>

            <Box id={'message-container'} sx={{
                flex: '1 1 auto',
                position: 'relative',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse'
            }}>

                <InfiniteScroll
                    inverse={true}
                    next={fetchMessage}
                    hasMore={paginationData ? paginationData.lastPage !== paginationData.currentPage : true}
                    loader={<CircularProgress/>}
                    dataLength={messages.length}
                    scrollableTarget={'message-container'}
                    style={{display: 'flex', flexDirection: 'column-reverse'}}
                    endMessage={
                        <p style={{textAlign: 'center'}}>
                            <b>No more messages</b>
                        </p>
                    }

                >
                    {messages.map((message, index) => (
                        <MessageBubble
                            key={message.id}
                            isSent={user.id === message.senderId}
                            message={message}/>

                    ))}
                    <Box ref={endBubbleRef}></Box>


                </InfiniteScroll>
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