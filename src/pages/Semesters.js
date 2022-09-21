import React from 'react'
import axios from "axios";
import {
    Box,
    Button,
    Dialog, DialogActions,
    DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, InputLabel, OutlinedInput,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {CustomDialogTitle} from "../components/MuiCustom/CustomDialogTitle";
import {useForm} from "react-hook-form";
import {Delete, Edit} from "@mui/icons-material";
import {toast} from "react-toastify";
import * as yup from 'yup'
import {yupResolver} from "@hookform/resolvers/yup";

function Semesters() {

    const [loading, setLoading] = React.useState(true);

    const [semesters, setSemesters] = React.useState([]);

    const [openModal, setOpenModal] = React.useState(false);

    const [selectedSemester, setSelectedSemester] = React.useState(null);

    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

    //validation

    const schema = yup.object().shape({
        id: yup.number(),
        name: yup.string().required(),
        shortName: yup.string().required(),
        totalCredits: yup.number().required(),
    });

    const {register, handleSubmit, reset, formState: {errors}} = useForm({
        resolver: yupResolver(schema)
    });

    const fetch = () => {
        axios.get('/semesters').then(res => {
            setLoading(false);
            setSemesters(res.data);
        })
    }

    React.useEffect(() => {
        fetch();
    }, []);

    function postSemester(data) {
        if (selectedSemester) {
            data.id = selectedSemester.id;
        }

        axios.post('/semesters', data)
            .then(res => {
                let {status, message} = res.data;
                if (status === 'success') {
                    toast.success(message)
                    setOpenModal(false);
                    fetch();
                } else {
                    toast.error(message);
                }
            })
    }

    const selectAndOpen = (item) => {
        setSelectedSemester(item);
        reset(item);
        setOpenModal(true);

    }

    const selectAndOpenDeleteModal = (item) => {
        setSelectedSemester(item);
        setOpenDeleteModal(true)
    }

    function performDelete() {
        axios.delete('/semesters/' + selectedSemester.id)
            .then(res => {
                let {status, message} = res.data;

                if (status === 'success') {
                    toast.success(message);
                    setSemesters(prev => prev.filter(item => item !== selectedSemester.id));
                    setOpenDeleteModal(false)
                } else {
                    toast.error(message);
                    setOpenDeleteModal(false);
                }

            }).catch(er => console.log(er))
    }

    const resetAndOpenModal = () => {
        setSelectedSemester(null);
        reset({});
        setOpenModal(true);
    }

    if (loading) {
        return <div>Loading...</div>
    }


    return (
        <div>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant={'h4'}>Semesters</Typography>
                <Button onClick={resetAndOpenModal} variant={'contained'}>Add</Button>
            </Stack>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Name
                        </TableCell>
                        <TableCell>ShortName</TableCell>
                        <TableCell>Total Credits</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {semesters.map((semester, index) => (
                        <TableRow key={index}>
                            <TableCell>{semester.name}</TableCell>
                            <TableCell>{semester.shortName}</TableCell>
                            <TableCell>{semester.totalCredits}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => selectAndOpen(semester)}>
                                    <Edit/>
                                </IconButton>
                                <IconButton onClick={() => selectAndOpenDeleteModal(semester)}>
                                    <Delete/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth={'sm'} fullWidth={true}>
                <CustomDialogTitle onClose={() => setOpenModal(false)}>
                    <Typography variant={'h4'}>Add Semester</Typography>
                </CustomDialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(postSemester)}>
                        <FormControl margin={'normal'} fullWidth={true}>
                            <InputLabel>Name*</InputLabel>
                            <OutlinedInput
                                {...register('name')}
                                type="text"
                                name="name"
                                label="Name*"

                            />
                            <FormHelperText error={!!errors?.name}>
                                {errors.name?.message}
                            </FormHelperText>
                        </FormControl>

                        <FormControl margin={'normal'} fullWidth={true}>
                            <InputLabel>Short Name*</InputLabel>
                            <OutlinedInput
                                {...register('shortName')}
                                type="text"
                                name="shortName"
                                label="Short Name*"

                            />
                            <FormHelperText error={!!errors?.shortName}>
                                {errors.shortName?.message}
                            </FormHelperText>
                        </FormControl>

                        <FormControl margin={'normal'} fullWidth={true}>
                            <InputLabel>Total Credits*</InputLabel>
                            <OutlinedInput
                                {...register('totalCredits')}
                                type="text"
                                name="totalCredits"
                                label="Total Credits*"

                            />
                            <FormHelperText error={!!errors?.totalCredits}>
                                {errors.totalCredits?.message}
                            </FormHelperText>
                        </FormControl>

                        <Stack direction={'row'} justifyContent={'end'}>
                            <Button type={'submit'} variant={'contained'}>Save</Button>
                        </Stack>

                    </form>
                </DialogContent>

            </Dialog>

            <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <DialogTitle><Typography variant={'h4'}>Delete This Semester?</Typography></DialogTitle>
                <DialogContent>
                    Read carefully proceeding this action! Semester can not be deleted if it
                    is connected with any students or courses.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
                    <Button onClick={performDelete} variant={"contained"} color={'error'}>Delete</Button>
                </DialogActions>
            </Dialog>

        </div>
    )

}

export default Semesters;
