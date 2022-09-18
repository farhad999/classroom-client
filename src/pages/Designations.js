import React from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, IconButton,
    InputLabel, Stack, Table, TableBody, TableCell, TableHead, TableRow,
    TextField,
    Typography, Icon, FormControl, OutlinedInput
} from "@mui/material";
import {useForm, Controller} from 'react-hook-form'
import axios from "axios";
import {Delete, Edit} from "@mui/icons-material";
import {CustomDialogTitle} from "../components/MuiCustom/CustomDialogTitle";
import * as Yup from 'yup'
import {yupResolver} from "@hookform/resolvers/yup";
import {toast} from "react-toastify";

function Designations() {

    const [open, setOpen] = React.useState(false);

    const [loading, setLoading] = React.useState(true);

    const [designations, setDesignations] = React.useState([]);

    const [selectedItem, setSelectedItem] = React.useState(null);

    const {handleSubmit, control, reset} = useForm();

    const fetchDesignations = () => {
        axios.get('/designations')
            .then(res => {
                setDesignations(res.data);
                setLoading(false);
            }).catch(er => console.log(er))
    }

    React.useEffect(() => {
        fetchDesignations();
    }, []);

    const postDesignation = (data) => {
        axios.post('/designations', data)
            .then(res => {
                let {status, message} = res.data;

                if(status === 'success'){
                    toast.success(message);
                    fetchDesignations();
                    setOpen(false);
                }

            }).catch(er => console.log(er))

    }

    const selectAndOpenModal = (item) => {
        setSelectedItem(item);
        reset(item);
        setOpen(true)
    }

    const resetAndOpenModal = () => {
        reset({});
        setOpen(true);
        setSelectedItem(null);
    }

    if (loading) {
        return <div>loading...</div>
    }

    return (
        <div>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography variant={'h4'}>Designations</Typography>
                <Button onClick={resetAndOpenModal} variant={'contained'}>Add Designation</Button>
            </Stack>

            {
                //show list designation
            }

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Rank</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {designations.map((designation) => (
                        <TableRow key={designation.id}>
                            <TableCell>{designation.name}</TableCell>
                            <TableCell>{designation.rank}</TableCell>
                            <TableCell>
                                <IconButton onClick={()=>selectAndOpenModal(designation)}>
                                    <Icon color={'primary'}>
                                        <Edit/>
                                    </Icon>
                                </IconButton>
                                <IconButton>
                                    <Icon color={'error'}>
                                        <Delete/>
                                    </Icon>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={open} onClose={() => setOpen(false)}
                    maxWidth={'sm'}
                    fullWidth={true}
            >
                <CustomDialogTitle onClose={() => setOpen(false)}>
                    <Typography variant={'h4'}>Add Designation</Typography>
                </CustomDialogTitle>

                <form onSubmit={handleSubmit(postDesignation)}>

                    <DialogContent>
                        <FormControl
                            fullWidth={true}
                            margin={'normal'}>
                            <Controller render={({field: {onChange, value}}) => (
                                <TextField label={'Designation Name'} value={value}
                                           onChange={event => onChange(event.target.value)}/>
                            )} name={'name'} control={control}/>

                        </FormControl>

                        <FormControl
                            fullWidth={true}
                            margin={'normal'}>
                            <InputLabel>Rank</InputLabel>
                            <Controller render={({field: {onChange, value}}) => (
                                <OutlinedInput fullWidth={true} label={'Rank'} value={value}
                                               onChange={event => onChange(event.target.value)}/>
                            )} name={'rank'} control={control}/>
                        </FormControl>

                        <Box>
                            <Button variant={'contained'} type={'submit'}>
                                {selectedItem ? 'Update' : 'Save'}
                            </Button>
                        </Box>
                    </DialogContent>

                </form>

            </Dialog>

        </div>
    )

}

export default Designations;
