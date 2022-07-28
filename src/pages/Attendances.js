import React from 'react'
import axios from "axios";
import {useParams} from "react-router-dom";
import {
    Button,
    Dialog,
    DialogContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField, Icon, TableContainer, Paper, Box, Typography, Stack, DialogTitle, Switch
} from "@mui/material";
import {CustomDialogTitle} from "../components/MuiCustom/CustomDialogTitle";
import {DataGrid} from "@mui/x-data-grid";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment'
import {DesktopDatePicker} from "@mui/x-date-pickers";
import moment from "moment";
import {groupBy, chain, uniqBy} from 'lodash'
import {CheckCircle, Cancel} from '@mui/icons-material'
import {toast} from "react-toastify";

function Attendances() {

    const {id} = useParams();

    const [students, setStudents] = React.useState([]);

    const [openDialog, setOpenDialog] = React.useState(false);

    const [selectedStudents, setSelectedStudents] = React.useState([]);

    //date for post

    const [date, setDate] = React.useState(new Date());

    //dates for header

    const [dates, setDates] = React.useState([]);

    const [studentAttendances, setStudentAttendances] = React.useState([]);

    //for update
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [selectedAtt, setSelectedAtt] = React.useState(null);
    const [switchAtt, setSwitchAtt] = React.useState(false);

    //fetch class students

    const fetchAttendance = () => {
        axios.get(`/c/${id}/att`)
            .then(res => {

                let attendances = res.data;

                let dates = uniqBy(attendances, 'date').map(item => item.date);

                setDates(dates);

                let at = chain(attendances).groupBy('userId').map((value, key) => {
                    return {
                        name: value[0].firstName + ' ' + value[0].lastName,
                        userId: value[0].userId,
                        studentId: value[0].studentId,
                        attendances: value.map(v => ({id: v.id, date: v.date, isAttend: v.isAttend}))
                    }
                }).value();

                setStudentAttendances(at);

            }).catch(er => console.log(er));
    }

    React.useEffect(() => {

        axios.get(`/c/${id}/participants?type=student`)
            .then(res => {
                setStudents(res.data);
            }).catch(er => console.log(er));

        fetchAttendance();

    }, []);

    const columns = [
        {
            field: 'studentId',
            headerName: 'StudentId',
        },
        {
            field: 'firstName',
            headerName: 'First name',
            width: 150,
        }, {
            field: 'lastName',
            headerName: 'Last name',
            width: 150,
        },];

    const addAttendance = () => {

        const att = students.map(student => {
            let item = {isAttendant: false};

            if (selectedStudents.includes(student.id)) {
                item.isAttendant = true;
            }

            item.userId = student.id;
            return item;
        });

        axios.post(`/c/${id}/att`, {
            students: att,
            date: moment(date).format('YYYY-MM-DD'),
        })
            .then(res => {
                let {status, message} = res.data;

                if (status === 'success') {
                    toast.success(message);
                    fetchAttendance();
                    setOpenDialog(false);
                } else {
                    toast.warn(message);
                }

            }).catch(er => console.log(er));
    }

    const onSelectRow = (row) => {
        setSelectedStudents(row);
    }

    const edit = (student, attend) => {
        setSelectedAtt({name: student.name, userId: student.userId, id: attend.id, date: attend.date})
        console.log('id', id, 'attend', attend);
        setSwitchAtt(attend.isAttend);
        setOpenEditDialog(true);
    }

    const onSwitchChange = (event, value) => {

        setSwitchAtt(value);

        axios.put(`/c/${id}/att/${selectedAtt.id}`, {isAttend: value})
            .then(res=> {

                let at = [...studentAttendances];

                at.map(st=> {
                    if(st.userId === selectedAtt.userId){
                        let {attendances} = st;
                        console.log('attt', 'selected', selectedAtt,  'st', st);
                        attendances.find(item=>item.id === selectedAtt.id).isAttend = value;
                        st.attendances = attendances;
                    }
                    return st;
                });

                setStudentAttendances(at);

                let {status} = res.data;
                if(status === 'success'){
                 toast.success('Updated');

                }
            }).catch(er=>console.log(er));

    }

    //

    return (
        <div>
            <Stack marginBottom={2} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant={'h4'}>
                    Attendances
                </Typography>
                <Button variant={'contained'} onClick={() => setOpenDialog(true)}>Add Attendance</Button>
            </Stack>

            <TableContainer sx={{maxHeight: 440}} component={Paper}>


                <Table stickyHeader={true}>
                    <TableHead>
                        <TableCell sx={{
                            position: 'sticky',
                            left: 0,
                            background: 'white',
                            zIndex: 10,
                        }}>Name</TableCell>
                        {dates.map((date) => (
                            <TableCell>
                                {moment(date).format('DD-MM')}
                            </TableCell>
                        ))}
                    </TableHead>
                    <TableBody>
                        {studentAttendances.map((student) => (
                            <TableRow>
                                <TableCell sx={{
                                    position: 'sticky',
                                    left: 0,
                                    background: 'white',
                                    zIndex: 9,
                                }}>{`${student.name}(${student.studentId})`}</TableCell>
                                {student.attendances.map((att) => (
                                    <TableCell sx={{writingMode: 'vertical'}}
                                               onClick={() => edit(student, att)}>{att.isAttend ?
                                        <Icon color={'success'}> <CheckCircle/> </Icon> :
                                        <Icon color={'error'}><Cancel/></Icon>}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </TableContainer>

            <Dialog open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    scroll={'body'}
                    maxWidth={'sm'}
                    fullWidth={true}
            >
                <CustomDialogTitle onClose={() => setOpenDialog(false)}>
                    <Typography variant={'h4'}>Add Attendance</Typography>
                </CustomDialogTitle>

                <DialogContent>

                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <Box sx={{display: 'flex', justifyContent: 'end', my: 2}}>
                            <DesktopDatePicker
                                label={'Select Date'}
                                renderInput={(props) =>
                                    <TextField {...props} />}
                                onChange={(d) => {
                                    setDate(d)
                                }}
                                value={date}
                            />
                        </Box>
                    </LocalizationProvider>


                    <DataGrid
                        autoHeight={true}
                        columns={columns}
                        rows={students}
                        checkboxSelection
                        onSelectionModelChange={onSelectRow}
                        hideFooterPagination={true}

                    />

                    <Button sx={{mt: 2}} disabled={!selectedStudents.length} variant={'contained'}
                            onClick={addAttendance}>Save Attendance</Button>

                </DialogContent>

            </Dialog>

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}
                    maxWidth={'xs'} fullWidth={true}
            >
                <DialogTitle>
                    <Typography variant={'h4'}>Update Attendance</Typography>
                </DialogTitle>

                <DialogContent>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                        <Typography variant={'h5'}>Student Name</Typography>
                        <Typography variant={'h5'}>{selectedAtt?.name}</Typography>
                    </Stack>
                    <Stack marginY={1} direction={'row'} justifyContent={'space-between'}>
                        <Typography variant={'h5'}>Student Id</Typography>
                        <Typography variant={'h5'}>{selectedAtt?.studentId}</Typography>
                    </Stack>
                    <Stack marginY={1} direction={'row'} justifyContent={'space-between'}>
                        <Typography variant={'h5'}>Date</Typography>
                        <Typography variant={'h5'}>{moment(selectedAtt?.date).format('DD MMMM YY')}</Typography>
                    </Stack>

                    <Stack marginY={1} direction={'row'} justifyContent={'space-between'}>
                        <Typography variant={'h5'}>isAttend</Typography>
                        <Switch checked={switchAtt} onChange={onSwitchChange}/>
                    </Stack>

                </DialogContent>

            </Dialog>

        </div>
    )
}

export default Attendances;