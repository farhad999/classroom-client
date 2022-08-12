import React from 'react'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar, Box, Button,
    IconButton,
    List,
    ListItem, Stack,
    TextField,
    Typography, Icon, Dialog, DialogContent, Paper, Divider, DialogTitle, DialogActions
} from "@mui/material";
import {Close, FileUploadOutlined, InsertLinkOutlined} from "@mui/icons-material";
import axios from "axios";
import {toast} from "react-toastify";
import {useParams} from "react-router-dom";
import {CustomDialogTitle} from "../MuiCustom/CustomDialogTitle";
import {useSelector} from "react-redux";
import PropTypes from "prop-types";

function CreatePost({url, onSuccess}) {

    const [files, setFiles] = React.useState([]);

    //file ref

    const fileRef = React.useRef(null);

    //toast with upload progress

    const toastId = React.useRef(null);

    //open post dialog

    const [openPostDialog, setOpenPostDialog] = React.useState(false);

    //form

    const [postBody, setPostBody] = React.useState('');

    const {user} = useSelector(state => state.auth);

    const doPost = () => {

        let formData = new FormData();

        files.forEach((attachment) => {
            formData.append('files', attachment);
        })

        formData.append('body', postBody);

        axios.post(url, formData, {
            headers: {
                'content-type': 'multipart/form-data',
            },
            onUploadProgress: p => {

                const progress = p.loaded / p.total;

                if (files.length) {

                    if (toastId.current === null) {
                        toastId.current = toast.info('Post Uploading...', {
                            progress,
                            hideProgressBar: false
                        });
                    } else {
                        toast.update(toastId.current, {progress})
                    }
                }
            }
        })
            .then(res => {
                let {status} = res.data;
                if (status === 'success') {
                    setPostBody("");
                    onSuccess();

                    if (files.length) {
                        toast.done(toastId.current);
                    } else {
                        toast.success('Post Uploaded');
                    }
                }
            }).catch(er => console.log(er))
    }

    function fileInputChange(event) {

        //files is not iterable by map or forEach

        let files = event.target.files;

        let f = [];

        for (let file of files) {
            f.push(file);
        }

        setFiles((prev) => [...prev, ...f]);

        console.log('files', files, typeof []);

    }

    function removeItem(index) {
        setFiles(files.filter((i, ind) => index !== ind));
    }

    return (

        <>
            <Stack sx={{
                '&:hover': {
                    cursor: 'pointer',
                }
            }} p={3} direction={'row'} spacing={2} alignItems={'center'}
                   onClick={() => setOpenPostDialog(true)}
                   component={Paper}>
                <Avatar>{user.firstName.charAt(0).toUpperCase()}</Avatar>
                <Typography>Post Something</Typography>
            </Stack>

            <Dialog open={openPostDialog} onClose={() => setOpenPostDialog(false)}
                    maxWidth={'sm'} fullWidth={true}
            >
                <CustomDialogTitle onClose={() => setOpenPostDialog(false)}>
                    <Typography variant={'h4'}>Create Post</Typography>
                    <Divider/>
                </CustomDialogTitle>
                <DialogContent>
                    <form>

                        <TextField
                            label={'Write something...'}
                            onChange={(event) => setPostBody(event.target.value)}
                            variant={'filled'}
                            multiline={true}
                            rows={4}
                            maxRows={6}
                            fullWidth={true}
                        />

                        {
                            //Attachments
                        }
                        <List>
                            {files.map((attachment, index) => (

                                <ListItem key={index} secondaryAction={<IconButton
                                    onClick={() => removeItem(index)}><Close/></IconButton>}>
                                    {attachment.name}
                                </ListItem>
                            ))}

                        </List>


                        <Stack my={2} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                            <Box>
                                <IconButton onClick={() => fileRef.current.click()}>
                                    <FileUploadOutlined color={'primary'}/></IconButton>
                            </Box>
                            <Box>
                                <Button onClick={doPost} disabled={!postBody.length} sx={{mt: 1}}
                                        variant={'contained'}>Post</Button>
                            </Box>

                        </Stack>

                        {
                            //Upload File
                        }

                        <input onChange={fileInputChange}
                               ref={fileRef} style={{display: 'none'}}
                               type={'file'}
                               multiple
                               accept={'image/jpeg, image/png, application/pdf, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/msword'}
                        />

                    </form>
                </DialogContent>
            </Dialog>

        </>
    )
}

CreatePost.propTypes = {
    url: PropTypes.string.isRequired,
    onSuccess: PropTypes.func,
}

export default CreatePost