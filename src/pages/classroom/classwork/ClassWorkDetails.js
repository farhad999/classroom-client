import React from 'react'
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Divider,
    Grid,
    Menu,
    MenuItem,
    Stack,
    Typography
} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import CreateOrUpdateAssignment from "../../../components/CreateOrUpdateAssignment";
import {toast} from "react-toastify";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import NotFound from "../../../components/Errors/NotFound";
import PermissionDenied from "../../../components/Errors/PermissionDenied";
import FileUploader from "../../../components/FileUploader";
import {useSelector} from "react-redux";

function ClassWorkDetails() {

    let {id, w} = useParams();

    const {user} = useSelector(state => state.auth);

    let navigator = useNavigate();

    const [assignment, setAssignment] = React.useState(null);

    const [errorCode, setErrorCode] = React.useState(null);

    //

    const ref = React.useRef();

    //open dialog

    const [openDialog, setOpenDialog] = React.useState(false);

    const [deleteDialog, setDeleteDialog] = React.useState(false);

    //attachments

    const [files, setFiles] = React.useState([]);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const [loading, setLoading] = React.useState(true);

    const fetchItem = () => {

        axios.get(`/c/${id}/assignments/${w}`)
            .then(res => {
                let assignment = res.data;
                setAssignment(res.data);
                setLoading(false);
                setFiles(assignment.studentAttachments)
                console.log("res", res);
            }).catch(er => {
            let {status} = er.response;
            setLoading(false);
            setErrorCode(status);
            console.log('er', er);

        })
    }

    React.useEffect(() => {

        fetchItem();
    }, []);

    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchorEl(null);
    };

    function editAssignment() {
        setOpenDialog(true);
        closeMenu();
    }

    function selectOpenDelete() {
        setDeleteDialog(true);
        closeMenu();
    }


    function deleteAssignment() {
        axios.delete(`/c/${id}/assignments/` + assignment.id)
            .then(res => {
                let {status} = res.data;
                if (status === 'success') {
                    toast.success('Assignment Deleted!');
                    navigator(`/c/${id}/w`);
                }
            }).catch(er => console.log(er));
    }

    function submitClassWork() {
        axios.post(`/c/${id}/assignments/${w}/submit_classwork`, {files: files})
            .then(res => {
                console.log('res', res);
            }).catch(er => console.log(er))
    }

    function onSuccess() {
        setOpenDialog(false);
        toast.success('Assignment Updated');
        fetchItem();
    }

    if (loading) {
        return <div>
            Loading...
        </div>
    }

    if (errorCode) {
        if (errorCode === 404) {
            return <NotFound/>
        } else if (errorCode === 401) {
            return <PermissionDenied/>
        }
    }

    return (

        <>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Box>
                        <Typography variant={'h4'} textTransform={'capitalize'}>{assignment.title}</Typography>
                        <Stack my={2} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                            <Stack direction={'row'} alignItems={'center'} gap={2}>
                                <Avatar>F</Avatar>
                                <Typography
                                    textTransform={'capitalize'}>{assignment.firstName + ' ' + assignment.lastName}</Typography>
                            </Stack>

                            <Button disableRipple={true} onClick={openMenu}>Menu</Button>
                            <Menu open={open}
                                  anchorEl={anchorEl}
                                  onClose={closeMenu}
                            >
                                <MenuItem onClick={editAssignment} disableRipple={true}>
                                    <Edit/>
                                    Edit</MenuItem>
                                <MenuItem onClick={() => selectOpenDelete(assignment)}>
                                    <Delete/>
                                    Delete</MenuItem>
                            </Menu>
                        </Stack>
                        <Typography>Points : {assignment.points}</Typography>
                        <Divider/>
                        <Typography>{assignment.description}</Typography>

                        <Box marginTop={2}>
                            {assignment.attachments.map((att) => (
                                <Card>
                                    <CardContent>
                                        <Typography>{att.name}</Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Box>
                </Grid>

                {
                    user.userType === 'student' &&


                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography my={2} variant={'h4'}>Your Work</Typography>
                                <FileUploader
                                    ref={ref}
                                    initialFiles={files}
                                    uploadDirectory={`users/${user.id}`}
                                    onUploadComplete={(file) => setFiles(prev => [...prev, file])}
                                    onFileRemoved={(files) => setFiles(files)}
                                    itemFullWidth={true}
                                    hideButton={true}
                                />

                                <Button disabled={assignment.status === 'submitted'}
                                        onClick={() => ref.current.openDialog()} sx={{my: 2}} variant={'outlined'}
                                        fullWidth={true}>Attach File</Button>

                                {
                                    assignment.status === 'submitted' ?
                                        <Typography my={2} textAlign={'center'} variant={'h4'}>Assignment
                                            Submitted</Typography>
                                        :
                                        <Button disabled={!files.length} onClick={submitClassWork} variant={'contained'}
                                                fullWidth={true}>Submit</Button>

                                }


                            </CardContent>
                        </Card>
                    </Grid>

                }
            </Grid>

            <CreateOrUpdateAssignment openDialog={openDialog} closeDialog={() => setOpenDialog(false)}
                                      initial={assignment} mode={'edit'}
                                      onSuccess={onSuccess}
                                      attachments={assignment.attachments}
                                      classId={id}/>

            <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}
                    maxWidth={'xs'}
            >
                <DialogTitle>Delete assignment?</DialogTitle>
                <DialogContent>
                    All contents related to this assignment will also be deleted
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
                    <Button onClick={deleteAssignment}>Delete</Button>
                </DialogActions>
            </Dialog>
        </>

    )
}

export default ClassWorkDetails;