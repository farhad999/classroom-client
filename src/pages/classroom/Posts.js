import React from 'react'
import {Controller, useForm} from "react-hook-form";
import axios from "axios";
import {toast} from "react-toastify";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Box, Button,
    IconButton,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {FileUploadOutlined, InsertLinkOutlined} from "@mui/icons-material";
import PostCard from "../../components/PostCard";
import {useParams} from "react-router-dom";


function Posts() {

    let [loading, setLoading] = React.useState(true);

    //params

    let {id} = useParams();

    //class posts

    const [posts, setPosts] = React.useState([]);

    const [postPagination, setPostPagination] = React.useState(null);

    const [currentPostPage, setCurrentPostPage] = React.useState(1);

    //form

    const {control, handleSubmit, reset} = useForm({
        defaultValues: {
            body: "",
        }
    });

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

        axios.post(`/c/${id}/posts`, data)
            .then(res => {
                let {status} = res.data;
                if (status === 'success') {
                    reset({});
                    getPosts();
                    toast.success("Success");
                }
            }).catch(er => console.log(er))

        console.log('data', data);
    }

    const loadMore = () => {
        setCurrentPostPage(prev => prev + 1);
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

                        <Stack my={2} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                            <Box>
                                <IconButton><FileUploadOutlined/></IconButton>
                                <IconButton><InsertLinkOutlined/></IconButton>
                            </Box>
                            <Button sx={{mt: 1}} type={'submit'} variant={'contained'}>Post</Button>
                        </Stack>


                    </form>
                </AccordionDetails>
            </Accordion>

            {
                //Posts section
            }

            {posts.map((post, index) => (
                <PostCard name={post.firstName + ' ' + post.lastName} time={post.createdAt} body={post.body}
                          key={index}/>
            ))}

            {
                postPagination.lastPage > currentPostPage &&

                <Box>
                    <Button onClick={loadMore}>Load More</Button>
                </Box>
            }

        </>
    )

}

export default Posts;