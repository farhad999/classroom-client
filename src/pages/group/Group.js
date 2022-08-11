import React from "react";
import {useParams, Link} from "react-router-dom";
import axios from "axios";
import {Box, Divider, Paper, Stack, Tab, Tabs, Typography} from "@mui/material";
import CoverImage from '../../assets/cover.jpg'
import {useDispatch, useSelector} from "react-redux";
import {fetchGroup} from "../../store/slices/groupSlice";

function Group() {

    let {id} = useParams();

    let currentPath = window.location.pathname;

    const dispatch = useDispatch();

    const {loading, group, accessInfo} = useSelector(state=>state.group);

    React.useEffect(() => {
        dispatch(fetchGroup(`/g/${id}`));
    }, []);

    if(loading){
        return<div>
            loading
        </div>
    }

    return (
        <div>
            <Paper elevation={1}>
                <Stack>
                    <Box>
                        {/* Cover Photo */}
                        <Box width={'100%'} sx={{aspectRatio: '3/1'}}>
                            <img src={CoverImage} style={{height: '100%', width: '100%', objectFit: 'cover'}}/>
                        </Box>
                        <Box px={3}>
                            <Typography textTransform={'capitalize'} my={1} variant={'h4'}>{group.name}</Typography>
                            <Tabs value={currentPath}
                                  variant="scrollable"
                                  scrollButtons="auto"
                            >
                                <Tab value={`/g/${id}`} label={'Posts'}
                                     component={Link} to={`/g/${id}`}
                                />
                                <Tab value={`/g/${id}/members`} label={'Members'}
                                     component={Link} to={`/g/${id}/members`}/>

                            </Tabs>
                        </Box>

                    </Box>
                </Stack>
            </Paper>

        </div>
    )
}

export default Group;