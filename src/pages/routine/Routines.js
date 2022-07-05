import React from 'react'
import {useForm, Controller} from "react-hook-form";
import moment from "moment";
import axios from "axios";
import {toast} from "react-toastify";
import {useNavigate} from 'react-router-dom'
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Dialog,
    DialogContent, FormControl, FormHelperText,
    Grid, IconButton, InputLabel, MenuItem, OutlinedInput, Select,
    Stack,
    Typography
} from "@mui/material";
import {Link} from 'react-router-dom'
import {Edit} from '@mui/icons-material'
import {CustomDialogTitle} from "../../components/MuiCustom/CustomDialogTitle";

export default function Routines() {

    const [showModal, setShowModal] = React.useState(false);

    const [loading, setLoading] = React.useState(true);

    const [routines, setRoutines] = React.useState([]);

    //form

    const {register, handleSubmit, control, reset, getValues, formState: {errors}} = useForm();

    //options

    const [selectedStatus, setSelectedStatus] = React.useState('');

    //selected

    const [selectedId, setSelectedId] = React.useState(null);

    //route

    let navigate = useNavigate();

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

    const addOrUpdate = (data) => {

        console.log('data', data);

        if (selectedId) {
            axios.put(`routines/${selectedId}`, data)
                .then(res => {
                    let {status} = res.data;
                    if (status === 'success') {
                        toast.success('Routine Updated');
                        let r = [...routines];
                        let index = r.findIndex(item => item.id === selectedId);

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

    //data table


    const openAddModal = () => {
        reset({
            name: moment().format('MMMM-YYYY'),
        });
        setSelectedStatus("");
        setShowModal(true);
    }

    const selectAndOpenModal = (item) => {
        let {name, status} = item;
        setSelectedId(item.id);
        setSelectedStatus(status);
        reset({name});
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
                        <Grid xs={6} sm={4} md={3} item key={index}>

                            <Card>

                                <CardContent>
                                    <Stack direction={'row'}
                                           justifyContent={'space-between'}
                                           alignItems={'center'}
                                    >
                                        <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                                            {routine.name}
                                        </Typography>
                                        <IconButton onClick={() => selectAndOpenModal(routine)}>
                                            <Edit fontSize={'small'}/>
                                        </IconButton>

                                    </Stack>
                                    <Typography textTransform={'capitalize'}>{routine.status}</Typography>

                                </CardContent>

                                <CardActions sx={{p: 2}}>
                                    <Button component={Link} to={`/routines/${routine.id}`} fullWidth={true} variant={'outlined'} size={'small'}>View</Button>
                                </CardActions>

                            </Card>

                        </Grid>
                    ))
                }

            </Grid>

            <Dialog open={showModal} onClose={() => setShowModal(false)}
                    maxWidth={'xs'}
                    fullWidth={true}
            >

                <CustomDialogTitle onClose={()=>setShowModal(false)}>
                    <Typography variant={'h4'}>Add/Update Routine</Typography>
                </CustomDialogTitle>

                <DialogContent>


                    <form onSubmit={handleSubmit(addOrUpdate)}>

                        <FormControl fullWidth margin={'normal'}>
                            <InputLabel>Routine Name*</InputLabel>
                            <OutlinedInput
                                {...register('name')}
                                type="text"
                                name="routineName"
                                label="Routine Name*"

                            />
                            <FormHelperText error={!!errors?.name}>
                                {errors.name?.message}
                            </FormHelperText>
                        </FormControl>

                        <FormControl fullWidth
                                     margin={'normal'}>
                            <InputLabel>
                                Routine Status
                            </InputLabel>

                            <Select
                                {...register('status', {required: true})}
                                label={'Routine Status'}
                                value={selectedStatus}
                                onChange={(event) => setSelectedStatus(event.target.value)}
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

        </div>
    )

}