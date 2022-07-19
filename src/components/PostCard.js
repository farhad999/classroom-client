import React from 'react'
import {
    Avatar, Box,
    Button,
    Card,
    CardContent,
    CardHeader, Divider,
    IconButton,
    InputAdornment, OutlinedInput,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {MoreVert, Send} from "@mui/icons-material";
import PropTypes from "prop-types";
import moment from "moment";

function PostCard(props) {

    const {body, time, name} = props;

    return (
        <Card sx={{my: 2}}>

            <CardHeader sx={{pb: 0}} avatar={<Avatar/>}
                        title={<Typography textTransform={'capitalize'} variant={'h5'}>{name}</Typography>}
                        subheader={<Typography variant={'h6'}>{moment(time).fromNow()}</Typography>}
                        action={<IconButton><MoreVert/></IconButton>}
            />

            <CardContent>

                {
                    //Post content section
                }

                <Box sx={{mb: 2}}>
                    <Typography>
                        {body}
                    </Typography>
                </Box>


                <Divider/>

                <Stack marginTop={2} direction={'row'} gap={5} alignItems={'center'}>
                    <Avatar/>
                    <OutlinedInput
                        sx={{borderRadius: '25px'}}
                        fullWidth={true}
                        endAdornment={<InputAdornment position={'end'}>
                            <IconButton>
                                <Send/>
                            </IconButton>
                        </InputAdornment>}
                    />
                </Stack>
            </CardContent>
        </Card>
    )

}

export default PostCard;

PostCard.propTypes = {
    body: PropTypes.string.isRequired,
}