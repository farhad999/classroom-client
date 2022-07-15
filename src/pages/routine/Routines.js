import React from 'react'
import {useForm, Controller} from "react-hook-form";
import moment from "moment";
import axios from "axios";
import {toast} from "react-toastify";
import {useNavigate} from 'react-router-dom'
import {
    Avatar, Badge,
    Box,
    Button,
    Card,
    CardActions,
    CardContent, CardHeader,
    Dialog,
    DialogContent, FormControl, FormHelperText,
    Grid, IconButton, InputLabel, ListItemIcon, Menu, MenuItem, OutlinedInput, Select,
    Stack, TextField,
    Typography
} from "@mui/material";
import {Link} from 'react-router-dom'
import {Delete, Edit, MoreHoriz, PersonAdd, Settings, Sync} from '@mui/icons-material'
import {CustomDialogTitle} from "../../components/MuiCustom/CustomDialogTitle";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DesktopTimePicker, MobileTimePicker} from "@mui/x-date-pickers";
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment'

export default function Routines() {

    const [showModal, setShowModal] = React.useState(false);

    const [loading, setLoading] = React.useState(true);

    const [routines, setRoutines] = React.useState([]);

    //routine context menu

    const [anchorEl, setAnchorEl] = React.useState(null);


    //form

    const {handleSubmit, control, reset, formState: {errors}} = useForm({
        defaultValues: {
            name: moment().format('MMMM-YYYY'),
            status: '',
            startTime: null,
            periodLength: '',
            isActive: false,
        }
    });

    //options

    //selected

    const [selectedRoutine, setSelectedRoutine] = React.useState(null);

    //route

    const options = [{
        name: 'Draft',
        value: 'draft',
    }, {
        name: 'Final',
        value: 'final',
    }];

    const fetchData = () => {
        axios.get('/routines')
            .then(res => {
                let {data, pagination} = res.data;
                setRoutines(data);
                setLoading(false);
            }).catch(er => console.log("er", er));
    }

    React.useEffect(() => {

        fetchData();

    }, []);

    const open = Boolean(anchorEl);
    const handleClick = (event, routine) => {
        setSelectedRoutine(routine);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const addOrUpdate = (data) => {

        console.log('data', data);

        data.startTime = moment(data.startTime).format('HH:mm:ss');

        //let data for update

        let {periodLength, ...rest} = data;

        if (selectedRoutine) {
            axios.put(`routines/${selectedRoutine.id}`, rest)
                .then(res => {
                    let {status} = res.data;
                    if (status === 'success') {
                        toast.success('Routine Updated');
                        let r = [...routines];
                        let index = r.findIndex(item => item.id === selectedRoutine.id);

                        r[index] = {...r[index], ...data};

                        setRoutines(r);

                        setShowModal(false);
                    }
                }).catch(er => console.log(er));
        } else {

            axios.post('/routines', data)
                .then(res => {
                    let {status} = res.data;

                    if (status === 'success') {
                        fetchData();
                        toast.success('Routine Added');
                        setShowModal(false);
                    }

                }).catch(er => console.log(er));
        }
    }

    const activateOrDeactivate = () => {
        axios.put(`routines/${selectedRoutine.id}/activate-deactivate`)
            .then(res => {
                let {status, message} = res.data;
                if (status === 'success') {
                    toast(message);
                    fetchData();
                } else if (status === 'failed') {
                    toast.error(message);
                }
            }).catch(er => console.log(er))
    }

    //data table


    const openAddModal = () => {
        reset({});
        setShowModal(true);
        setSelectedRoutine(null);
    }

    const selectAndOpenModal = () => {
        let item = routines.find(item => item.id === selectedRoutine.id);
        let {name, status, periodLength, startTime} = item;
        reset({name, status, periodLength, startTime: moment(startTime, 'HH:mm:ss')});
        setShowModal(true);

    }

    if (loading) {
        return <div>loading....</div>
    }

    return (
        <div>
            <Stack direction={'row'}
                   justifyContent={'space-between'}
                   alignItems={'center'}
                   sx={{mb: 1}}
            >
                <Typography variant={'h3'}>
                    Routines
                </Typography>

                <Button variant={'contained'} onClick={openAddModal}>Add Routine</Button>
            </Stack>

            <Grid container spacing={2}>
                {
                    routines.map((routine, index) => (
                        <Grid xs={12} sm={6} md={4} item key={index}>

                            <Card>

                                <CardHeader title={routine.name}
                                            action={<IconButton onClick={(event) => handleClick(event, routine)}>
                                                <MoreHoriz sx={{bgcolor: 'pallete.grey[100]'}} fontSize={'small'}/>
                                            </IconButton>}
                                />

                                <CardContent>

                                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2}}>
                                        <Badge color={'primary'} badgeContent={routine.isActive && 'Active'}></Badge>
                                    </Box>

                                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                        <Typography variant={'h5'}>Status</Typography>
                                        <Typography variant={'h6'}
                                                    textTransform={'capitalize'}>{routine.status}</Typography>
                                    </Box>

                                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                        <Typography variant={'h5'}>Period Length</Typography>
                                        <Typography variant={'h6'}
                                                    textTransform={'capitalize'}>{routine.periodLength} Minutes</Typography>
                                    </Box>

                                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                        <Typography variant={'h5'}>Start Time</Typography>
                                        <Typography variant={'h6'}
                                                    textTransform={'capitalize'}>{routine.startTime}</Typography>
                                    </Box>

                                </CardContent>

                                <CardActions sx={{p: 2}}>
                                    <Button component={Link} to={`/routines/${routine.id}`} fullWidth={true}
                                            variant={'outlined'} size={'small'}>View</Button>
                                </CardActions>

                            </Card>

                        </Grid>
                    ))
                }

            </Grid>


            <LocalizationProvider dateAdapter={AdapterMoment}>

                <Dialog open={showModal} onClose={() => setShowModal(false)}
                        maxWidth={'xs'}
                        fullWidth={true}
                >

                    <CustomDialogTitle onClose={() => setShowModal(false)}>
                        <Typography variant={'h4'}>Add/Update Routine</Typography>
                    </CustomDialogTitle>

                    <DialogContent>


                        <form onSubmit={handleSubmit(addOrUpdate)}>

                            <Controller render={({field: {value, onChange}}) => (
                                <FormControl fullWidth margin={'normal'}>
                                    <InputLabel>Routine Name*</InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        name="routineName"
                                        label="Routine Name*"
                                        value={value}
                                        onChange={(event) => onChange(event.target.value)}
                                    />
                                    <FormHelperText error={!!errors?.name}>
                                        {errors.name?.message}
                                    </FormHelperText>
                                </FormControl>
                            )} name={'name'} control={control}/>


                            <Controller render={({field: {value, onChange}}) => (
                                <FormControl fullWidth
                                             margin={'normal'}
                                             disabled={selectedRoutine?.isActive}
                                >
                                    <InputLabel>
                                        Routine Status
                                    </InputLabel>

                                    <Select
                                        label={'Routine Status'}
                                        value={value}
                                        onChange={(event) => onChange(event.target.value)}
                                    >

                                        {
                                            options.map((option, index) => (
                                                <MenuItem key={index} value={option.value}>{option.name}</MenuItem>
                                            ))
                                        }

                                    </Select>

                                    <FormHelperText error={!!errors?.status}>
                                        {errors.status?.message}
                                    </FormHelperText>

                                </FormControl>
                            )} name={'status'}
                                        control={control}

                            />


                            <Controller render={({field: {value, onChange}}) => (
                                <DesktopTimePicker
                                    label="Start Time"
                                    value={value}
                                    onChange={(value) => onChange(value)}
                                    renderInput={(params) => <TextField {...params} fullWidth={true} />}
                                />
                            )} name={'startTime'} control={control}/>

                            <Controller render={({field: {value, onChange}}) => (
                                <FormControl
                                    disabled={!!selectedRoutine}
                                    margin={'normal'}
                                    fullWidth={true}
                                >
                                    <InputLabel>Period Length</InputLabel>
                                    <OutlinedInput
                                        value={value}
                                        onChange={(event) => onChange(event.target.value)}
                                        label={'Period Length'}

                                    >

                                    </OutlinedInput>
                                </FormControl>
                            )} name={'periodLength'}
                                        control={control}/>


                            <Box sx={{mt: 2}}>
                                <Button variant={'contained'} fullWidth={true}
                                        type={'submit'}
                                >
                                    Submit
                                </Button>
                            </Box>
                        </form>

                    </DialogContent>
                </Dialog>

            </LocalizationProvider>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >

                <MenuItem onClick={selectAndOpenModal}>
                    <ListItemIcon>
                        <Edit fontSize="small"/>
                    </ListItemIcon>
                    Edit
                </MenuItem>
                <MenuItem onClick={activateOrDeactivate}>
                    <ListItemIcon>
                        <Sync fontSize="small"/>
                    </ListItemIcon>
                    {selectedRoutine?.isActive ? 'Deactivate' : 'Activate'}
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <Delete color={'primary.warning'} fontSize="small"/>
                    </ListItemIcon>
                    Delete
                </MenuItem>
            </Menu>

        </div>
    )

}