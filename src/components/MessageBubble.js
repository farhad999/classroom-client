import React from "react";
import {Box, Typography} from "@mui/material";
import moment from "moment";


function MessageBubble({isSent, message}){

    let style = isSent ? {bgcolor: '#1280fd', ml: 'auto'}: {bgcolor: '#ffdd11'};

    return (
        <Box py={1} >
            <Box sx={style} maxWidth={'50%'} px={2} py={1} borderRadius={'10px'}>
                <Typography>{message.body}</Typography>
                <Typography textAlign={'right'}>{moment(message.createdAt).format('hh:mm A')}</Typography>
            </Box>
        </Box>
    )
}

export default MessageBubble;