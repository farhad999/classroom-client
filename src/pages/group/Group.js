import React from "react";
import {useParams, Link, useNavigate, Outlet} from "react-router-dom";
import axios from "axios";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider, Menu, MenuItem,
    Paper,
    Stack,
    Tab,
    Tabs, TextField,
    Typography
} from "@mui/material";
import CoverImage from '../../assets/cover.jpg'
import {useDispatch, useSelector} from "react-redux";
import {fetchGroup, sendOrCancelJoinRequest} from "../../store/slices/groupSlice";
import {toast} from "react-toastify";
import {queryParams} from "../../utils/queryParams";
import {ContentCopy, Add} from "@mui/icons-material";
import {CustomDialogTitle} from "../../components/MuiCustom/CustomDialogTitle";
import ErrorWrapper from "../../components/ErrorWrapper";

function Group() {

    let {id} = useParams();

    let currentPath = window.location.pathname;

    let currentUrl = window.location.href;

    let code = queryParams(currentUrl, 'code');

    //host

    let host = window.location.origin;

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const {loading, group, accessInfo, error} = useSelector(state => state.group);

    const [openInviteDialog, setOpenInviteDialog] = React.useState(false);

    //handling menu

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    React.useEffect(() => {
        dispatch(fetchGroup(`/g/${id}`));
    }, []);

    const copyToClipBoard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Link Copied to Clipboard');
    }

    const joinRequest = () => {

        let url = code ? `/g/${id}/join?code=${code}` : `/g/${id}/join`;

        dispatch(sendOrCancelJoinRequest(url))
            .then(res => {
                let {status, message} = res.payload;

                console.log("status", status);

                if (status === 'success') {
                    if (code) {
                        navigate(`/g/${id}`)
                        toast.success('Joined Successful');
                    } else {
                        toast.success(message);
                    }

                } else {
                    console.log('message');
                    toast.warn(message)
                }
            }).catch(er => console.log(er));
    }

    if (loading) {
        return <div>
            loading
        </div>
    }


    return (
        <ErrorWrapper status={error.statusCode}>
            <Paper elevation={1}>
                <Stack>
                    <Box>
                        {/* Cover Photo */}
                        <Box width={'100%'} sx={{aspectRatio: '3/1'}}>
                            <img src={CoverImage} style={{height: '100%', width: '100%', objectFit: 'cover'}}/>
                        </Box>
                        <Box px={3}>

                            <Stack my={2} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                <Typography textTransform={'capitalize'} my={1} variant={'h4'}>{group.name}</Typography>

                                {
                                    accessInfo.isMember ?
                                        <Stack direction={'row'}>
                                            <Button onClick={handleClick} variant={'contained'}
                                                    color={'grey'}>Options</Button>
                                            <Button startIcon={<Add/>} variant={'contained'}
                                                    onClick={() => setOpenInviteDialog(true)}>Invite</Button>
                                        </Stack>
                                        :
                                        code ? <Button variant={'contained'}
                                                       onClick={joinRequest}
                                            >Accept Invite</Button>
                                            :
                                            <Button onClick={joinRequest}
                                                    variant={'contained'}>
                                                {accessInfo.isRequestSent ? "Cancel Request" : "Join Request"}
                                            </Button>
                                }


                            </Stack>

                            {/* Hide if has invite code */}

                            {
                                !code &&


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

                            }

                        </Box>

                    </Box>
                </Stack>
            </Paper>

            <Menu open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
            >
                {accessInfo.isAdmin &&
                    <MenuItem onClick={handleClose} component={Link} to={`/g/${id}/requests`}>Requests</MenuItem>
                }
                <Divider />
                <MenuItem>Leave Group</MenuItem>
            </Menu>

            <Box py={2}>
                <Outlet/>
            </Box>

            <Dialog open={openInviteDialog} onClose={() => setOpenInviteDialog(false)}
                    maxWidth={'xs'}
                    fullWidth={true}
            >
                <CustomDialogTitle onClose={() => setOpenInviteDialog(false)}>
                    <Typography textAlign={'center'} variant={'h4'}>Invite your classmates</Typography>
                    <Divider/>
                </CustomDialogTitle>

                <Divider/>

                <DialogContent>

                    <Stack direction={'row'} justifyContent={'space-between'}>
                        <Typography variant={'h5'}>Invite Code</Typography>
                        <Typography letterSpacing={1.5} variant={'h5'}>{group.invitationCode}</Typography>
                    </Stack>

                    <Typography mt={1} variant={'h5'}>Invitation Link</Typography>

                    <Stack spacing={2} direction={'row'} alignItems={'center'}>
                        <TextField value={`${host}/g/${id}?code=${group.invitationCode}`}
                                   inputProps={{
                                       readOnly: true
                                   }}
                                   fullWidth={true}
                        />
                        <Button startIcon={<ContentCopy/>}
                                onClick={() => copyToClipBoard(`${host}/g/${id}?code=${group.invitationCode}`)}
                                variant={'contained'}>Copy</Button>
                    </Stack>
                </DialogContent>
            </Dialog>

        </ErrorWrapper>
    )
}

export default Group;