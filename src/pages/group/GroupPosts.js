import React from 'react'
import CreatePost from "../../components/posts/CreatePost";
import axios from "axios";
import {useParams} from "react-router-dom";
import PostCard from "../../components/PostCard";
import {Box, Button} from "@mui/material";

function GroupPosts() {


    let [loading, setLoading] = React.useState(true);

    //params

    let {id} = useParams();

    //class posts

    const [posts, setPosts] = React.useState([]);

    const [postPagination, setPostPagination] = React.useState(null);

    const [currentPostPage, setCurrentPostPage] = React.useState(1);

    const getPosts = () => {
        axios.get(`/g/${id}/posts`)
            .then(res => {
                let {data, pagination} = res.data;

                setPostPagination(pagination);

                if (currentPostPage !== 1) {
                    setPosts([...posts, ...data]);
                } else {
                    setPosts(data);
                }
                setLoading(false);

            }).catch(er => console.log(er))
    }

    React.useEffect(() => {
        getPosts();
    }, []);

    const loadMore = () => {
        setCurrentPostPage(prev => prev + 1);
    }

    if (loading) {
        return <div>Loading</div>
    }

    return (
        <div>
            <CreatePost url={`/g/${id}/posts`} onSuccess={getPosts}/>

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

        </div>
    )

}

export default GroupPosts;