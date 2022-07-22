import React from 'react'
import {Controller, useForm} from "react-hook-form";
import axios from "axios";
import {toast} from "react-toastify";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControl,
    IconButton, InputLabel, List, ListItem,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {Close, FileUploadOutlined, InsertLinkOutlined} from "@mui/icons-material";
import PostCard from "../../components/PostCard";
import {useParams} from "react-router-dom";
import FileViewer from "../../components/FileViewer/FileViewer";
import {useDispatch, useSelector} from "react-redux";

import {closeFile} from "../../store/slices/fileViewer";

function Posts() {

    let [loading, setLoading] = React.useState(true);

    //file ref

    const fileRef = React.useRef(null);

    //params

    let {id} = useParams();

    //class posts

    const [posts, setPosts] = React.useState([]);

    const [postPagination, setPostPagination] = React.useState(null);

    const [currentPostPage, setCurrentPostPage] = React.useState(1);

    //add link dialog

    const [openLinkDialog, setOpenLinkDialog] = React.useState(false);

    const [files, setFiles] = React.useState([]);

    //const [openFileViewer, setOpenFileViewer] = React.useState(false);

    const {open, file} = useSelector(state => state.fileViewer);

    const dispatch = useDispatch();

    //form

    const {register, control, handleSubmit, reset} = useForm({
        defaultValues: {
            body: "",
        }
    });

    //file controller

    const getPosts = async () => {

        if (!loading) {
            setLoading(true);
        }

        const res = await axios.get(`/c/${id}/posts?page=${currentPostPage}`);

        let {data, pagination} = res.data;

        setPostPagination(pagination);

        if (currentPostPage !== 1) {
            setPosts([...posts, ...data]);
        } else {
            setPosts(data);
        }

        setLoading(false);
    }

    React.useEffect(() => {
        getPosts();
    }, [currentPostPage]);

    const doPost = (data) => {

        let formData = new FormData();

        files.forEach((attachment) => {
            formData.append('files', attachment);
        })

        formData.append('body', data.body);

        axios.post(`/c/${id}/posts`, formData, {
            headers: {
                'content-type': 'multipart/form-data',
            }
        })
            .then(res => {
                let {status} = res.data;
                if (status === 'success') {
                    reset({});
                    getPosts();
                    toast.success("Success");
                }
            }).catch(er => console.log(er))

        console.log('data', data, files);
    }

    const loadMore = () => {
        setCurrentPostPage(prev => prev + 1);
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


    if (loading) {
        return <div>Loading</div>
    }

    return (
        <>
            <Accordion sx={{my: 2}} disableGutters={true} TransitionProps={{unmountOnExit: true}}>
                <AccordionSummary sx={{
                    '.MuiAccordionSummary-content': {
                        display: 'flex', alignItems: 'center', gap: '10px'
                    }
                }}>
                    <Avatar/>
                    <Typography>Post Something</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <form onSubmit={handleSubmit(doPost)}>
                        <Controller render={({field: {value, onChange}}) => (

                            <TextField
                                value={value}
                                onChange={(event) => onChange(event.target.value)}
                                variant={'filled'}
                                multiline={true}
                                rows={4}
                                fullWidth={true}
                            />

                        )} name={'body'}
                                    control={control}

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
                                <IconButton onClick={() => fileRef.current.click()}><FileUploadOutlined/></IconButton>
                                <IconButton onClick={() => setOpenLinkDialog(true)}><InsertLinkOutlined/></IconButton>
                            </Box>
                            <Button sx={{mt: 1}} type={'submit'} variant={'contained'}>Post</Button>
                        </Stack>

                        {
                            //Upload File
                        }

                        <input onChange={fileInputChange} ref={fileRef} style={{display: 'none'}} type={'file'}
                               multiple/>

                    </form>
                </AccordionDetails>
            </Accordion>

            {
                //Posts section
            }

            {posts.map((post, index) => (
                <div>
                    <PostCard name={post.firstName + ' ' + post.lastName} time={post.createdAt} body={post.body}
                              key={index}
                              attachments={post.attachments}
                    />
                </div>
            ))}

            {
                postPagination.lastPage > currentPostPage &&

                <Box>
                    <Button onClick={loadMore}>Load More</Button>
                </Box>
            }

            <Dialog open={openLinkDialog} onClose={() => setOpenLinkDialog(false)}>
                <DialogTitle>Add Link</DialogTitle>
                <DialogContent>
                    <TextField variant={'filled'}/>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenLinkDialog(false)}>Cancel</Button>
                    <Button>Add Link</Button>
                </DialogActions>

            </Dialog>


            <FileViewer />


        </>
    )

}

export default Posts;