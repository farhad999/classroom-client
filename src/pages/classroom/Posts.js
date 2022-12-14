import React from 'react'
import axios from "axios";
import {
    Box, Button,
} from "@mui/material";
import PostCard from "../../components/PostCard";
import {useParams} from "react-router-dom";
import FileViewer from "../../components/FileViewer/FileViewer";
import {useDispatch, useSelector} from "react-redux";

import {closeFile} from "../../store/slices/fileViewer";
import CreatePost from "../../components/posts/CreatePost";
import RenderIf from "../../components/wrappers/RenderIf";

function Posts() {

    let [loading, setLoading] = React.useState(true);

    const {user} = useSelector(state => state.classroom);

    //params

    let {id} = useParams();

    //class posts

    const [posts, setPosts] = React.useState([]);

    const [postPagination, setPostPagination] = React.useState(null);

    const [currentPostPage, setCurrentPostPage] = React.useState(1);


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

    const loadMore = () => {
        setCurrentPostPage(prev => prev + 1);
    }

    if (loading) {
        return <div>Loading</div>
    }

    return (
        <>

            <RenderIf condition={user.isMainTeacher}>
                <CreatePost url={`/c/${id}/posts`} onSuccess={getPosts}/>
            </RenderIf>


            {posts.map((post, index) => (
                <PostCard name={post.firstName + ' ' + post.lastName} time={post.createdAt} body={post.body}
                          key={index}
                          attachments={post.attachments}
                />
            ))}


            <RenderIf condition={postPagination.lastPage > currentPostPage}>
                <Box>
                    <Button onClick={loadMore}>Load More</Button>
                </Box>
            </RenderIf>

            <FileViewer/>

        </>
    )

}

export default Posts;
