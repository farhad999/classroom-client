import React from 'react'
import axios from "axios";
import {useParams, useNavigate} from "react-router-dom";
import {useForm, Controller} from "react-hook-form";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    FormControl,
    FormHelperText,
    InputLabel, MenuItem,
    OutlinedInput,
    Paper, Select, Stack, TextField, Typography,
    useMediaQuery
} from '@mui/material'
import {CustomDialogTitle} from '../components/MuiCustom/CustomDialogTitle'
import {Edit, Delete, PanoramaFishEye, Visibility} from '@mui/icons-material'
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from 'yup'
import AlertDialog from "../components/MuiCustom/AlertDialog";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker, MobileDatePicker} from "@mui/x-date-pickers";
import moment from "moment";
import {toast} from "react-toastify";

//TODO Current semester selectable for student add

function Users(props) {

    let {type} = useParams();

    let [users, setUsers] = React.useState([]);

    let [currentPage, setCurrentPage] = React.useState(1);

    let [loading, setLoading] = React.useState(true);

    let [paginationData, setPaginationData] = React.useState(null);

    //modal

    let [showModal, setShowModal] = React.useState(false);

    const navigate = useNavigate();

    //form

    const userSchema = yup.object().shape({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        email: yup.string().email().required(),
        password: yup.string().min(8),
        userType: yup.string(),
        studentId: yup.string().when('userType', {
            is: 'student',
            then: yup.string().required(),
        }),
        session: yup.string().when('userType', {
            is: 'student',
            then: yup.string().required(),
        }),
        semesterId: yup.string().when('userType', {
            is: 'student',
            then: yup.string().required(),
        }),
        designationId: yup.string().when('userType', {
            is: 'student',
            otherwise: yup.string().required(),
        }),
        joiningDate: yup.string().when('userType', {
            is: 'student',
            otherwise: yup.string().required(),
        }),
    });

    let {register, handleSubmit, control, formState: {errors}, reset} = useForm({resolver: yupResolver(userSchema)});

    //selected

    let [selectedId, setSelectedId] = React.useState('');

    //for student only

    let [semesters, setSemesters] = React.useState([]);

    let [selectedSemester, setSelectedSemester] = React.useState("");

    //set delete dialog

    let [showAlertDialog, setShowAlertDialog] = React.useState(false);

    let [designations, setDesignations] = React.useState([]);

    //

    const [modalTitle, setModalTitle] = React.useState('');

    React.useEffect(() => {

        const fetch = async () => {
            setLoading(true);
            if (type === 'student' && !semesters.length) {
                let res = await axios.get('/semesters');
                let {semesters} = res.data;
                setSemesters(semesters);
            } else {
                let res = await axios.get('/designations');
                setDesignations(res.data);
            }
            await fetchData('params', 1);
            setLoading(false);
        }

        fetch();

    }, [type]);

    const fetchData = async (reloadType, value) => {

        let url = `/users?type=${type}&page=${value}`;

        try {
            let res = await axios.get(url);

            let {data, pagination} = res.data;

            setUsers(data);

            if (!paginationData || reloadType === 'params') {
                setPaginationData(pagination);
                setCurrentPage(1);
            }
        } catch (er) {
            console.log(er);
        }
    }


    const onPageUpdate = (value) => {
        fetchData("", value + 1);
        setCurrentPage(value + 1);
    }

    const addOrUpdate = (data) => {

        console.log('data', data);

        if (data.hasOwnProperty('joiningDate')) {
            data.joiningDate = moment(data.joiningDate).format('YYYY-MM-DD');
        }

        axios.post('/users', data).then(res => {
            let {status, message} = res.data;

            if (status === 'success') {
                fetchData('', 1);
                setCurrentPage(1);
                setShowModal(false);
                toast.success(message)
            } else {
                toast.error(message)
            }

        }).catch(er => console.log('er', er));

    }
    //for update
    const selectAndOpenModal = (item) => {


        let {id, email, firstName, lastName} = item;

        let resetData = {id, email, firstName, lastName};

        if (type === 'student') {
            let {semesterId, session, studentId} = item;
            resetData = {...resetData, semesterId, session, studentId}
        } else {
            let {designationId, joiningDate} = item;
            resetData = {...resetData, designationId, joiningDate};
        }

        //setSelectedSemester(semesterId);

        reset(resetData);

        setSelectedId(id);

        setModalTitle(`Update ${type}`);

        setShowModal(true);
    }
    //for add
    const resetAndOpenModal = () => {
        if (type !== 'student') {
            reset({joiningDate: null});
        }
        setSelectedId(null);
        setSelectedSemester('');
        setModalTitle(`Add ${type}`);
        setShowModal(true);
    }

    //for delete

    const selectAndOpenAlert = (item) => {
        setSelectedId(item.id);
        setShowAlertDialog(true);
    }


    const onDelete = async () => {

        try {

            let res = await axios.delete(`users/${selectedId}`);

            let {status} = res.data;
            if (status === 'success') {
                let filterUsers = users.filter(item => item.id !== selectedId);
                setUsers(filterUsers);
                setShowAlertDialog(false);
            }

        } catch (er) {
            console.log(er);
        }

    }

    let columns = [{
        field: 'firstName',
        headerName: 'FirstName',
        flex: 1,
        minWidth: '100px'
    }, {
        field: 'lastName',
        headerName: 'LastName',
        flex: 1,
    },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
        }, {

            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            flex: 1,
            getActions: (params) => [

                <GridActionsCellItem label={'View'}
                                     icon={<Visibility/>}
                                     onClick={()=>navigate('/user/'+params.row.id)}

                />,


                <GridActionsCellItem label={"Edit"}
                                     icon={<Edit/>}
                                     onClick={() => selectAndOpenModal(params.row)}
                />,

                <GridActionsCellItem
                    icon={<Delete/>}
                    label="Delete"
                    onClick={() => selectAndOpenAlert(params.row)}
                />

            ]
        }];

    //data table

    if (loading) {
        return <div>loading...</div>
    }

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>

            <Stack sx={{mb: 2}} direction={"row"} justifyContent={"space-between"}
                   alignItems={'center'}
            >
                <Typography textTransform={'capitalize'} variant={'h3'} component={'div'}>
                    {type}s
                </Typography>
                <Button variant={'contained'} onClick={resetAndOpenModal}>
                    Add {type}s
                </Button>
            </Stack>

            {
                !loading &&
                <>
                    <Paper sx={{height: '600px', width: '100%'}}>

                        <DataGrid columns={columns}
                                  rows={users}
                                  rowCount={paginationData.total}
                                  pageSize={10}
                                  page={currentPage - 1}
                                  onPageChange={onPageUpdate}
                                  paginationMode={'server'}
                                  disableSelectionOnClick={true}
                                  disableColumnFilter={true}
                                  disableColumnSelector={true}
                                  disableColumnMenu={true}
                        />

                    </Paper>

                </>
            }

            <Dialog open={showModal} onClose={() => setShowModal(false)}
                    maxWidth={'sm'}
                    fullWidth={true}
                    scroll={'body'}
            >
                <CustomDialogTitle onClose={() => setShowModal(false)}>
                    <Typography variant={'h4'}>{modalTitle}</Typography>
                </CustomDialogTitle>

                <DialogContent>


                    <form onSubmit={handleSubmit(addOrUpdate)}>

                        <input type={'hidden'} value={type} name={'userType'} {...register('userType')}/>

                        <FormControl fullWidth margin={'normal'}>
                            <InputLabel>First Name*</InputLabel>
                            <OutlinedInput
                                {...register('firstName')}
                                type="text"
                                name="firstName"
                                label="First Name*"

                            />
                            <FormHelperText error={!!errors?.firstName}>
                                {errors.firstName?.message}
                            </FormHelperText>
                        </FormControl>


                        <FormControl fullWidth margin={'normal'}>
                            <InputLabel>Last Name*</InputLabel>
                            <OutlinedInput
                                {...register('lastName')}
                                type="text"
                                name="lastName"
                                label="Last Name*"

                            />
                            <FormHelperText error={!!errors?.lastName}>
                                {errors.lastName?.message}
                            </FormHelperText>
                        </FormControl>

                        <FormControl fullWidth margin={'normal'}>
                            <InputLabel>Email</InputLabel>
                            <OutlinedInput
                                {...register('email')}
                                type="text"
                                name="email"
                                label="Email"

                            />
                            <FormHelperText error={!!errors?.email}>
                                {errors.email?.message}
                            </FormHelperText>
                        </FormControl>

                        {!selectedId &&

                            <FormControl
                                fullWidth
                                margin={'normal'}

                            >
                                <InputLabel
                                >Password</InputLabel>
                                <OutlinedInput
                                    {...register('password')}
                                    type={'text'}
                                    name="password"
                                    label="Password"
                                />

                                <FormHelperText error={!!errors?.password}>
                                    {errors.password?.message}
                                </FormHelperText>
                            </FormControl>
                        }


                        {
                            type === 'student' ?

                                <Box>

                                    <FormControl fullWidth
                                                 margin={'normal'}>
                                        <InputLabel>
                                            Select Semester
                                        </InputLabel>
                                        <Controller render={({field}) => (
                                            <Select
                                                label={'Select Semester'}
                                                {...field}

                                            >
                                                {semesters.map((item) => (
                                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                                ))}
                                            </Select>
                                        )} name={'semesterId'} control={control}/>

                                        <FormHelperText error={!!errors?.semesterId}>
                                            {errors.semesterId?.message}
                                        </FormHelperText>
                                    </FormControl>


                                    <FormControl fullWidth margin={'normal'}>
                                        <InputLabel>Student Id</InputLabel>
                                        <OutlinedInput
                                            {...register('studentId')}
                                            type="text"
                                            name="studentId"
                                            label="Student ID"

                                        />
                                        <FormHelperText error={!!errors?.studentId}>
                                            {errors.studentId?.message}
                                        </FormHelperText>
                                    </FormControl>

                                    <FormControl fullWidth margin={'normal'}>
                                        <InputLabel>Session</InputLabel>
                                        <OutlinedInput
                                            {...register('session')}
                                            type="text"
                                            name="session"
                                            label="Session"

                                        />
                                        <FormHelperText error={!!errors?.session}>
                                            {errors.session?.message}
                                        </FormHelperText>
                                    </FormControl>

                                </Box>

                                : <Box>

                                    <FormControl fullWidth
                                                 margin={'normal'}>
                                        <InputLabel>
                                            Select Designation
                                        </InputLabel>

                                        <Controller render={({field: {value, onChange}}) => (
                                            <Select
                                                label={'Select Designation'}
                                                value={value}
                                                onChange={(event) => onChange(event.target.value)}

                                            >
                                                {designations.map((item) => (
                                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                                ))}
                                            </Select>
                                        )} name={'designationId'}
                                                    control={control}/>


                                        <FormHelperText error={!!errors?.designationId}>
                                            {errors.designationId?.message}
                                        </FormHelperText>
                                    </FormControl>


                                    <FormControl fullWidth margin={'normal'}>
                                        <Controller render={({field: {value, onChange}}) => (
                                            <MobileDatePicker
                                                label="Joining Date"
                                                inputFormat="DD/MM/YYYY"
                                                value={value}
                                                disableFuture={true}
                                                onChange={(value) => onChange(value)}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        )} name={'joiningDate'} control={control}/>

                                        <FormHelperText error={!!errors?.joiningDate}>
                                            {errors.joiningDate?.message}
                                        </FormHelperText>
                                    </FormControl>

                                </Box>

                        }


                        <Box sx={{mt: 2}}>

                            <Button
                                disableElevation
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                color="secondary"
                            >
                                Submit
                            </Button>

                        </Box>

                    </form>


                </DialogContent>

            </Dialog>

            <AlertDialog
                open={showAlertDialog}
                onClose={() => setShowAlertDialog(false)}
                action={onDelete}
                title={"Are you sure?"}
                description={"This item will be deleted"}
            >
            </AlertDialog>

        </LocalizationProvider>
    )

}

export default Users;
