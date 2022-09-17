import React from "react";
import {Box, Typography} from "@mui/material";
import moment from "moment";

function MessageBubble({isSent, message, isGrouped}) {

    let style = isSent ? {bgcolor: 'primary.main', ml: 'auto', color: 'grey.50'} : {bgcolor: '#ededed'};

    return (
        <>

            {!isGrouped && <Box height={'10px'}></Box>}

            <Typography color={'primary'}>{(!isSent && !isGrouped) && message.firstName}</Typography>

            <Box sx={{py: '1px'}}>
                <Box sx={style} minWidth={'150px'} width={'fit-content'} maxWidth={'70%'} px={2} py={1}
                     borderRadius={'10px'}>

                    <Typography>{message.body}</Typography>
                    <Typography fontSize={'0.7rem'} color={'inherit'} lineHeight={'1'} variant={'h6'}
                                textAlign={'right'}>{moment(message.createdAt).format('hh:mm A')}</Typography>
                </Box>
            </Box>
        </>
    )
}

export default MessageBubble;