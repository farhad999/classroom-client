import React from 'react'
import {useForm, Controller} from "react-hook-form";
import moment from "moment";
import axios from "axios";
import {toast} from "react-toastify";
import {
    Badge,
    Box,
    Button,
    Card,
    CardActions,
    CardContent, CardHeader,
    Dialog, DialogActions,
    DialogContent, DialogTitle, FormControl, FormHelperText,
    Grid, IconButton, InputLabel, ListItemIcon, Menu, MenuItem, OutlinedInput, Select,
    Stack, TextField,
    Typography, Icon
} from "@mui/material";
import {Link} from 'react-router-dom'
import {Delete, Edit, MoreHoriz, Sync} from '@mui/icons-material'
import {CustomDialogTitle} from "../../components/MuiCustom/CustomDialogTitle";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DesktopTimePicker} from "@mui/x-date-pickers";
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment'

export default function Routines() {

    const [showModal, setShowModal] = React.useState(false);

    const [loading, setLoading] = React.useState(true);

    const [routines, setRoutines] = React.useState([]);

    const [semesters, setSemesters] = React.useState([]);

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

    //routine context menu

    const [anchorEl, setAnchorEl] = React.useState(null);


    //form

    const formDefaultValues = {
        name: moment().format('MMMM-YYYY'),
        status: 'draft',
        startTime: null,
        periodLength: '',
        isActive: false,
        type: 'simple',
        offDays: '',
    };

    const {handleSubmit, control, reset, formState: {errors}} = useForm({
        defaultValues: formDefaultValues
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

    //routine types

    const routineTypes = [{
        name: 'Simple',
        value: 'simple',
    }, {
        name: 'Priority Based',
        value: 'priority'
    }];

    const days = [
        {name: 'SAT', value: 'sat'},
        {name: 'SUN', value: 'sun'},
        {name: 'MON', value: 'mon'},
        {name: 'TUE', value: 'tue'},
        {name: 'WED', value: 'wed'},
        {name: 'THU', value: 'thu'},
        {name: 'FRI', value: 'fri'},
    ];

    const fetchData = () => {
        axios.get('/routines')
            .then(res => {
                let {data} = res.data;
                setRoutines(data);
                setLoading(false);
            }).catch(er => console.log("er", er));
    }

    React.useEffect(() => {

        fetchData();

        axios.get('semesters')
            .then(res => {
                const {semesters} = res.data;
                setSemesters(semesters);
            }).catch(er => console.log(er));

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

        data.startTime = moment(data.startTime).format('HH:mm');
        data.endTime = moment(data.endTime).format('HH:mm');
        data.breakTime=moment(data.breakStartTime).format('HH:mm')+'-'+moment(data.breakEndTime).format('HH:mm');

        delete data.breakStartTime;
        delete data.breakEndTime;

        //let data for update

        if (selectedRoutine) {
            data.id = selectedRoutine.id;
        }

        console.log('data',data);

        axios.post('/routines', data)
            .then(res => {

                let {status, message} = res.data;

                if (status === 'success') {
                    fetchData();
                    toast.success(message);
                    setShowModal(false);
                }

            }).catch(er => console.log(er));

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
        reset(formDefaultValues);
        setShowModal(true);
        setSelectedRoutine(null);
    }

    const selectAndOpenModal = () => {
        let item = routines.find(item => item.id === selectedRoutine.id);
        let {name, status, periodLength, startTime,
            type, offDays, semesters, endTime, breakTime} = item;
        reset({name, status, periodLength,
            type, offDays, semesters,
            startTime: moment(startTime, 'HH:mm:ss'),
            endTime: moment(endTime, 'HH:mm:ss'),
            breakStartTime: moment(breakTime.split('-')[0], 'HH:mm'),
            breakEndTime: moment(breakTime.split('-')[1], 'HH:mm'),
        });
        setShowModal(true);

    }

    const deleteRoutine = () => {
        axios.delete(`/routines/${selectedRoutine.id}/`)
            .then(res=> {
                const {status} = res.data;
                if(status === 'success'){
                    setRoutines(prev=>prev.filter(item=>item!==selectedRoutine.id));
                    setOpenDeleteDialog(false);
                }
            }).catch(er=>console.log(er));
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

                                <CardHeader title={<Typography textTransform={'capitalize'} variant={'h5'}>{routine.name}</Typography> }
                                            action={<IconButton onClick={(event) => handleClick(event, routine)}>
                                                <MoreHoriz sx={{bgcolor: 'pallete.grey[100]'}} fontSize={'small'}/>
                                            </IconButton>}
                                />

                                <CardContent>

                                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2}}>
                                        <Badge color={'primary'} badgeContent={routine.isActive && 'Active'}></Badge>
                                    </Box>

                                    <Box my={0.5} sx={{display: 'flex', justifyContent: 'space-between'}}>
                                        <Typography variant={'h5'}>Status</Typography>
                                        <Typography variant={'h6'}
                                                    textTransform={'capitalize'}>{routine.status}</Typography>
                                    </Box>

                                    <Box my={0.5} sx={{display: 'flex', justifyContent: 'space-between'}}>
                                        <Typography variant={'h5'}>Type</Typography>
                                        <Typography variant={'h6'}
                                                    textTransform={'capitalize'}>{routine.type}</Typography>
                                    </Box>

                                    <Box my={0.5} sx={{display: 'flex', justifyContent: 'space-between'}}>
                                        <Typography variant={'h5'}>Period Length</Typography>
                                        <Typography variant={'h6'}
                                                    textTransform={'capitalize'}>{routine.periodLength} Minutes</Typography>
                                    </Box>

                                    <Box my={0.5} sx={{display: 'flex', justifyContent: 'space-between'}}>
                                        <Typography variant={'h5'}>Class Time</Typography>
                                        <Typography variant={'h6'}
                                                    textTransform={'capitalize'}>{moment(routine.startTime, 'HH:mm:ss').format('hh:mmA')+"-"+moment(routine.endTime, 'HH:mm:ss').format('hh:mmA')}</Typography>
                                    </Box>

                                    <Box my={0.5} sx={{display: 'flex', justifyContent: 'space-between'}}>
                                        <Typography variant={'h5'}>Break Time</Typography>
                                        <Typography variant={'h6'}
                                                    textTransform={'capitalize'}>{moment(routine.breakTime.split('-')[0], 'HH:mm').format('hh:mmA')+"-"+moment(routine.breakTime.split('-')[1], 'HH:mm').format('hh:mmA')}</Typography>
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
                        maxWidth={'sm'}
                        fullWidth={true}
                        scroll={'body'}
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
                                <FormControl fullWidth
                                             margin={'normal'}
                                             disabled={selectedRoutine?.isActive}
                                >
                                    <InputLabel>
                                        Routine Type
                                    </InputLabel>

                                    <Select
                                        label={'Routine Type'}
                                        value={value}
                                        onChange={(event) => onChange(event.target.value)}
                                    >

                                        {
                                            routineTypes.map((option, index) => (
                                                <MenuItem key={index} value={option.value}>{option.name}</MenuItem>
                                            ))
                                        }

                                    </Select>

                                    <FormHelperText error={!!errors?.type}>
                                        {errors.type?.message}
                                    </FormHelperText>

                                </FormControl>
                            )} name={'type'}
                                        control={control}

                            />

                            <Controller render={({field: {value, onChange}}) => (
                                <FormControl fullWidth
                                             margin={'normal'}
                                    //  disabled={selectedRoutine?.isActive}
                                >
                                    <InputLabel>
                                        Weekly Off Days
                                    </InputLabel>

                                    <Select
                                        multiple={true}
                                        label={'Weekly Off Days'}
                                        value={value ? value.split(',') : []}
                                        onChange={(event) => onChange(event.target.value.join(','))}
                                    >

                                        {
                                            days.map((option, index) => (
                                                <MenuItem key={index} value={option.value}>{option.name}</MenuItem>
                                            ))
                                        }

                                    </Select>

                                    <FormHelperText error={!!errors?.type}>
                                        {errors.type?.message}
                                    </FormHelperText>

                                </FormControl>
                            )} name={'offDays'}
                                        control={control}

                            />

                            <Controller render={({field: {value, onChange}}) => (
                                <FormControl fullWidth
                                             margin={'normal'}
                                    //  disabled={selectedRoutine?.isActive}
                                >
                                    <InputLabel>
                                        Semesters
                                    </InputLabel>

                                    <Select
                                        multiple={true}
                                        label={'Semesters'}
                                        value={value ? value.split(',') : []}
                                        onChange={(event) => onChange(event.target.value.join(','))}
                                    >

                                        {
                                            semesters.map((option, index) => (
                                                <MenuItem key={index} value={`${option.id}`}>{option.shortName}</MenuItem>
                                            ))
                                        }

                                    </Select>

                                    <FormHelperText error={!!errors?.semesters}>
                                        {errors.semesters?.message}
                                    </FormHelperText>

                                </FormControl>
                            )} name={'semesters'}
                                        control={control}

                            />


                            <Box my={2}>
                                <Typography textAlign={'center'}>Routine Start and End Time</Typography>
                            </Box>

                            <Stack direction={'row'} gap={2}>

                                <Controller render={({field: {value, onChange}}) => (
                                    <DesktopTimePicker
                                        label="Start Time"
                                        value={value}
                                        onChange={(value) => onChange(value)}
                                        renderInput={(params) => <TextField {...params} fullWidth={true}/>}
                                    />
                                )} name={'startTime'} control={control}/>

                                <Controller render={({field: {value, onChange}}) => (
                                    <DesktopTimePicker
                                        label="End Time"
                                        value={value}
                                        onChange={(value) => onChange(value)}
                                        renderInput={(params) => <TextField {...params} fullWidth={true}/>}
                                    />
                                )} name={'endTime'} control={control}/>


                            </Stack>

                            <Box my={2}>
                                <Typography textAlign={'center'}>Break Start and End Time</Typography>
                            </Box>

                            <Stack direction={'row'} gap={2}>

                                <Controller render={({field: {value, onChange}}) => (
                                    <DesktopTimePicker
                                        label="Start Time"
                                        value={value}
                                        onChange={(value) => onChange(value)}
                                        renderInput={(params) => <TextField {...params} fullWidth={true}/>}
                                    />
                                )} name={'breakStartTime'} control={control}/>

                                <Controller render={({field: {value, onChange}}) => (
                                    <DesktopTimePicker
                                        label="End Time"
                                        value={value}
                                        onChange={(value) => onChange(value)}
                                        renderInput={(params) => <TextField {...params} fullWidth={true}/>}
                                    />
                                )} name={'breakEndTime'} control={control}/>


                            </Stack>


                            <Controller render={({field: {value, onChange}}) => (
                                <FormControl
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

            <Dialog open={openDeleteDialog}
                    onClose={()=>setOpenDeleteDialog(false)}
                    maxWidth={'xs'}
                    fullWidth={true}
            >
                <DialogTitle><Typography variant={'h4'}>Delete This Routine</Typography></DialogTitle>
                <DialogContent>
                    This Routine will be deleted.
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button onClick={deleteRoutine} variant={'contained'} color={'warning'}>Delete</Button>
                </DialogActions>

            </Dialog>

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
                        <Icon color={'primary'}>
                            <Edit fontSize="small"/>
                        </Icon>
                    </ListItemIcon>
                    Edit
                </MenuItem>
                <MenuItem onClick={activateOrDeactivate}>
                    <ListItemIcon>
                        <Icon color={'primary'}>
                            <Sync fontSize="small"/>
                        </Icon>
                    </ListItemIcon>
                    {selectedRoutine?.isActive ? 'Deactivate' : 'Activate'}
                </MenuItem>

                <MenuItem onClick={()=>setOpenDeleteDialog(true)}>
                    <ListItemIcon>
                        <Icon color={'error'}>
                            <Delete fontSize="small"/>
                        </Icon>
                    </ListItemIcon>
                    Delete
                </MenuItem>
            </Menu>

        </div>
    )

}