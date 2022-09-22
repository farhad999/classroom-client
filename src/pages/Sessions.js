import React from 'react'
import {
    Box,
    Button, Card, CardContent, CardHeader,
    Dialog, DialogActions,
    DialogContent, DialogTitle,
    FormControl, FormHelperText, Grid, IconButton, InputLabel, Menu, MenuItem,
    OutlinedInput,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {Add, MoreVert} from "@mui/icons-material";
import axios from "axios";
import {CustomDialogTitle} from "../components/MuiCustom/CustomDialogTitle";
import {toast} from "react-toastify";

function Sessions() {

    const [loading, setLoading] = React.useState(true);

    const [sessions, setSessions] = React.useState([]);

    const [openModal, setOpenModal] = React.useState(false);

    const [selectedSession, setSelectedSession] = React.useState(null);

    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

    const [inputSession, setInputSession] = React.useState("");

    const [validationError, setValidationError] = React.useState("");

    const [menuAnchor, setMenuAnchor] = React.useState(null);

    const fetchSessions = () => {
        axios.get('/sessions')
            .then(res => {
                setLoading(false);
                setSessions(res.data);
            }).catch(er => console.log(er))
    }

    React.useEffect(() => {
        fetchSessions();
    }, []);

    const resetAndOpenModal = () => {
        setInputSession("");
        setSelectedSession(null);
        setOpenModal(true);
    }

    const handleMenu = (event, session) => {
        setMenuAnchor(event.currentTarget);
        setSelectedSession(session);
        console.log('sessions', session)
    };
    const handleClose = () => {
        setMenuAnchor(null);
    };


    if (loading) {
        return <div>loading...</div>
    }

    function submit() {
        //validate
        let regex = /([0-9]){4}-[0-9]{2}$/

        if (!regex.test(inputSession)) {
            setValidationError('Session is not valid')
            return;
        }
        let currentTwoDigit = inputSession.slice(2, 4);
        let nextTwoDigit = inputSession.slice(-2);


        if (nextTwoDigit - currentTwoDigit !== 1) {
            setValidationError("Difference between two years must be one");
            return;
        }

        setValidationError("");

        let data = {name: inputSession};

        if (selectedSession) {
            data.id = selectedSession.id;
        }

        axios.post('/sessions', data).then(res => {
            let {status, message} = res.data;

            if (status === 'success') {
                toast.success(message)
                setOpenModal(false);
                fetchSessions();
            } else {
                toast.error(message)
            }

        }).catch(er => console.log(er))

    }

    function openUpdateModal() {
        setInputSession(selectedSession.name);
        handleClose();
        setOpenModal(true);
    }

    function handleDeleteModal() {
        handleClose();
        setOpenDeleteModal(true);
    }

    function performDelete() {
        axios.delete('/sessions/'+selectedSession.id)
            .then(res=> {
                let {status, message} = res.data;
                if(status === 'success'){
                    toast.success(message);
                    setSessions(prev=>prev.filter(item=>item.id !== selectedSession.id));
                    setOpenDeleteModal(false);
                }else{
                    toast.error(message);
                    setOpenDeleteModal(false);
                }
            }).catch(er=>console.log(er))
    }

    return (
        <div>
            <Stack my={2} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant={'h4'}>Sessions</Typography>
                <Button onClick={resetAndOpenModal} variant={'contained'} startIcon={<Add/>}> Create </Button>
            </Stack>
            <Grid container={true} spacing={2}>

                {sessions.map((session, index) => (
                    <Grid key={index} item sm={4} md={3} xs={6}>

                        <Card key={index}>
                            <CardHeader action={<IconButton onClick={(event) => handleMenu(event, session)}><MoreVert/></IconButton>}></CardHeader>
                            <CardContent>
                                <Typography variant={'h4'}
                                            textAlign={'center'}>{session.name}</Typography></CardContent>
                        </Card>
                    </Grid>
                ))}

            </Grid>

            {
                //Add new session
            }

            <Dialog open={openModal} onClose={() => setOpenModal(false)}>

                <CustomDialogTitle onClose={() => setOpenModal(false)}>
                    <Typography variant={'h4'}>Add Session</Typography>
                </CustomDialogTitle>

                <DialogContent>

                    <Typography>
                        Session will be constructed as four digit of current year - last two digits of next year
                        example: 2021-2022, 2022-23, 2023-24,
                    </Typography>

                    <FormControl margin={'normal'} fullWidth={true}>
                        <InputLabel>Session Name</InputLabel>
                        <OutlinedInput
                            label={'Enter Session'}
                            onChange={event => setInputSession(event.target.value)}
                            value={inputSession}
                        />
                        <FormHelperText error={!!validationError}>{validationError}</FormHelperText>
                    </FormControl>

                    <Stack direction={'row'} justifyContent={'space-between'}>
                        <Button onClick={submit} type={'submit'} variant={'contained'}>Add</Button>
                    </Stack>

                </DialogContent>

            </Dialog>

            {
                //Dialog Delete
            }

            <Dialog open={openDeleteModal} onClose={()=>setOpenDeleteModal(false)}>
                <DialogTitle>
                    <Typography variant={'h4'}>Delete This Session?</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography>Deleting this item will delete all students</Typography>
                </DialogContent>

                <DialogActions>
                    <Button onClick={()=>setOpenDeleteModal(false)}>Cancel</Button>
                    <Button onClick={performDelete} variant={'contained'} color={'error'}>Delete</Button>
                </DialogActions>

            </Dialog>

            <Menu open={!!menuAnchor}
                  anchorEl={menuAnchor}
                  onClose={handleClose}
                  transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                  }}
            >
                <MenuItem onClick={openUpdateModal}>Edit</MenuItem>
                <MenuItem onClick={handleDeleteModal}>Delete</MenuItem>
            </Menu>

        </div>
    )
}

export default Sessions;
