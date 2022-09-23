import React from 'react'
import {useSelector} from "react-redux";
import axios from "axios";
import {useForm, Controller} from "react-hook-form";
import {toast} from "react-toastify";
import {
    Box,
    DialogContent,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Paper,
    Select,
    Stack,
    Typography
} from "@mui/material";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import {CustomDialogTitle} from "../components/MuiCustom/CustomDialogTitle";
import {Dialog, Button} from "@mui/material";
import {Edit, Delete} from '@mui/icons-material'
import AlertDialog from "../components/MuiCustom/AlertDialog";

function Courses() {

    let [courses, setCourses] = React.useState([]);

    let [pagination, setPagination] = React.useState(null);

    const [loading, setLoading] = React.useState(true);

    const [semesters, setSemesters] = React.useState([]);

    let [current, setCurrent] = React.useState(1);

    const [selectedSemester, setSelectedSemester] = React.useState(null);

    //modal

    const [showModal, setShowModal] = React.useState(false);

    const [modalTitle, setModalTitle] = React.useState("");

    const [showAlertModal, setShowAlertModal] = React.useState(false);

    //form

    let {handleSubmit, register, reset, formState: {errors}} = useForm();

    //select

    let [selectedId, setSelectedId] = React.useState(null);

    const fetch = async () => {

        try {

            let res = await axios.get('/courses', {
                params: {
                    page: current
                }
            });

            let {data, pagination} = res.data;

            setCourses(data);

            setPagination(pagination);

            if (!semesters.length) {

                let response = await axios.get('/semesters');

                setSemesters(response.data);
            }

            setLoading(false);

        } catch (er) {
            console.log('er', er);
        }

    }

    React.useEffect(() => {
        fetch();
    }, [current]);


    const selectAndOpenModal = (data) => {
        let {id, semesterId, ...rest} = data;
        setSelectedId(data.id);
        reset(rest);
        setShowModal(true);
        setModalTitle("Update Course");
        setSelectedSemester(semesterId);
    }

    const resetAndOpenModal = () => {
        reset({});
        setShowModal(true);
        setModalTitle("Add Course")
        setSelectedSemester('');
    }

    const onPageChange = (value) => {
        setCurrent(value + 1);
    }

    const onClose = () => {
        setShowModal(false);
    }

    //add or update

    const addOrUpdate = async (data) => {

        if (selectedId) {
            axios.put(`/courses/${selectedId}`, data)
                .then(res => {
                    let {status} = res.data;
                    if (status === 'success') {

                        let c = [...courses];

                        let index = c.findIndex(course => course.id === selectedId);

                        c[index] = {...data, id: selectedId};

                        setCourses(c);

                        setShowModal(false);

                        toast.success("Course Updated!");
                    }
                }).catch(er => console.log('er', er));
        } else {
            axios.post('/courses', data)
                .then(res => {
                    let {status} = res.data;
                    if (status === 'success') {
                        toast.success("Course Added!");
                        fetch();
                    }
                })
                .catch(er => console.log(er));
        }

    }

    const deleteCourse = () => {

        axios.delete(`/courses/${selectedId}`)
            .then(res => {
                let {status} = res.data;
                if (status === 'success') {
                    setCourses((prev) => prev.filter(item => item.id !== selectedId));
                    setShowAlertModal(false);
                    toast.success("Course Deleted!");
                }
            }).catch(er => console.log(er))


    }

    const selectAndOpenAlert = (item) => {
        setSelectedId(item.id);
        setShowAlertModal(true);
    }

    const columns = [{
        field: 'name',
        headerName: 'Title'
    }, {
        field: 'courseCode',
        headerName: 'Course Code'
    }, {
        field: 'credit',
        headerName: 'Credit'
    }, {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        getActions: (params) => [
            <GridActionsCellItem label={"Edit"}
                                 icon={<Edit/>}
                                 onClick={() => selectAndOpenModal(params.row)}
            />,

            <GridActionsCellItem
                icon={<Delete/>}
                label="Delete"
                onClick={() => selectAndOpenAlert(params.row)}
            />,
        ]
    }];

    if (loading) {
        return <div>loading....</div>
    }

    return (
        <div>

            <Stack direction={'row'} justifyContent={'space-between'}
                   alignItems={'center'}
                   sx={{mb: 2}}
            >
                <Typography variant={'h3'} component={'div'}>
                    Courses
                </Typography>
                <Button variant={'contained'} onClick={resetAndOpenModal}>Add Course</Button>
            </Stack>

            <Paper sx={{height: '500px', width: '100%'}}>
                <DataGrid columns={columns} rows={courses}
                          disableSelectionOnClick={false}
                          rowCount={pagination.total}
                          pageSize={10}
                          page={current - 1}
                          paginationMode={'server'}
                          onPageChange={onPageChange}
                />
            </Paper>


            <Dialog title={modalTitle} open={showModal} onClose={onClose}
                    maxWidth={'xs'} fullWidth={true}
            >

                <CustomDialogTitle onClose={onClose} >
                    <Typography variant={'h3'}>{modalTitle}</Typography>
                </CustomDialogTitle>

                <DialogContent>

                    <form onSubmit={handleSubmit(addOrUpdate)}>

                        <FormControl fullWidth margin={'normal'}>
                            <InputLabel>Course Name*</InputLabel>
                            <OutlinedInput
                                {...register('name')}
                                type="text"
                                name="courseName"
                                label="Course Name*"

                            />
                            <FormHelperText error={!!errors?.name}>
                                {errors.name?.message}
                            </FormHelperText>
                        </FormControl>

                        <FormControl fullWidth margin={'normal'}>
                            <InputLabel>Course Code*</InputLabel>
                            <OutlinedInput
                                {...register('courseCode')}
                                type="text"
                                name="courseCode"
                                label="Course Code*"

                            />
                            <FormHelperText error={!!errors?.courseCode}>
                                {errors.firstName?.message}
                            </FormHelperText>
                        </FormControl>

                        <FormControl fullWidth margin={'normal'}>
                            <InputLabel>Course Credit*</InputLabel>
                            <OutlinedInput
                                {...register('credit')}
                                type="text"
                                name="credit"
                                label="Course Credit*"

                            />
                            <FormHelperText error={!!errors?.credit}>
                                {errors.credit?.message}
                            </FormHelperText>
                        </FormControl>

                        <FormControl fullWidth
                                     margin={'normal'}>
                            <InputLabel>
                                Select Semester
                            </InputLabel>
                            <Select
                                {...register('semesterId')}
                                label={'Select Semester'}
                                value={selectedSemester}
                                onChange={(event) => setSelectedSemester(event.target.value)}

                            >
                                {semesters.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText error={!!errors?.semesterId}>
                                {errors.semesterId?.message}
                            </FormHelperText>
                        </FormControl>

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
                title={'Do you want to delete?'}
                open={showAlertModal} onClose={() => setShowAlertModal(false)}
                action={deleteCourse}
            />

        </div>
    )
}

export default Courses;
