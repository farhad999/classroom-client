import React from 'react'
import {
    Avatar, Box,
    Button,
    Card,
    CardContent,
    CardHeader, Divider, Grid,
    IconButton, ImageList, ImageListItem, ImageListItemBar,
    InputAdornment, ListSubheader, OutlinedInput,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {Download, MoreVert, Send} from "@mui/icons-material";
import PropTypes from "prop-types";
import moment from "moment";
import DocumentIcon from '../assets/document-icon.png'
import {viewFile} from "../store/slices/fileViewer";
import {useDispatch} from "react-redux";

function PostCard(props) {

    const {body, time, name, attachments} = props;

    const dispatch = useDispatch();

    function getThumb(file) {

        let splitted = file.name.split('.');

        let ext = splitted[splitted.length - 1];

        //host

        let host = 'http://localhost:5000/files/';

        if (ext === 'jpg' || ext === 'jpeg') {
            return host + file.name;
        } else if (ext === 'pdf') {
            return DocumentIcon;
        }

    }

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

                    <Grid container>
                        {attachments.map((item) => (
                            <Grid item sm={6}>

                                <Card>
                                    <Stack onClick={()=>dispatch(viewFile({file: 'http://localhost:5000/files/'+item.name}))} direction={'row'} alignItems={'center'}>
                                        <img
                                            width={'70px'}
                                            src={getThumb(item)}
                                            alt={item.name}
                                            loading="lazy"
                                        />
                                        <Box sx={{display: 'flex', direction: 'row', gap: 5}}>
                                            <Typography>{item.name}</Typography>
                                            <IconButton><Download /></IconButton>
                                        </Box>
                                    </Stack>

                                </Card>
                            </Grid>
                        ))}
                    </Grid>

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