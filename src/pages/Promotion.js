import React from 'react'
import axios from "axios";
import {
    Box,
    Button,
    FormControl, Grid,
    InputLabel,
    MenuItem, Paper,
    Select,
    Typography
} from "@mui/material";

import {DataGrid} from "@mui/x-data-grid";
import {toast} from "react-toastify";

function Promotion() {

    const [semesters, setSemesters] = React.useState([]);

    const [sessions, setSessions] = React.useState([]);

    const [selectedSession, setSelectedSession] = React.useState(null);
    const [selectedSemester, setSelectedSemester] = React.useState(null);

    const [selectedSessionTo, setSelectedSessionTo] = React.useState(null);

    const [selectedSemesterTo, setSelectedSemesterTo] = React.useState(null);

    const [students, setStudents] = React.useState([]);

    const [selectedStudents, setSelectedStudents] = React.useState([]);

    React.useEffect(() => {
        Promise.all([axios.get('/semesters'), axios.get('/sessions')])
            .then(res => {
                console.log('res', res)
                setSemesters(res[0].data);
                setSessions(res[1].data);
            }).catch(er => console.log(er))
    }, []);

    function getStudents() {
        axios.get('/users', {
            params: {
                type: 'student',
                semesterId: selectedSemester,
                sessionId: selectedSession,
                disablePaginate: true,
            }
        }).then(res => {
            setStudents(res.data)
        })
    }

    const columns = [{
        headerName: 'FirstName',
        field: 'firstName',
    }, {
        headerName: 'LastName',
        field: 'lastName',
    },
        {
            headerName: 'StudentId',
            field: 'studentId',
        },
        {
            headerName: 'Semester',
            field: 'semesterName',
        }, {
            field: 'session'
        }];

    function promote() {
        axios.post('/users/promote_students', {
            students: selectedStudents,
            sessionFrom: selectedSession,
            semesterFrom: selectedSemester,
            sessionTo: selectedSessionTo,
            semesterTo: selectedSemesterTo,

        }).then(res => {
            let {status, message} = res.data;

            if (status === 'success') {
                toast.success(message);
                setSelectedStudents([]);
                setStudents([]);
                setSelectedSemesterTo(null);
                setSelectedSessionTo(null);
                setSelectedSession(null);
                setSelectedSemester(null);
            } else {
                toast.error(message);
            }
        })
    }

    function onRowSelect(row) {
        console.log('row', row);
        setSelectedStudents(row);
    }

    return <div>

        <Typography my={3} variant={'h4'}>Promotion</Typography>

        <Grid container={true} spacing={4}>
            <Grid item lg={6}>
                <Box component={Paper} p={1}>
                    <Typography variant={'h5'}>Promotion from</Typography>
                    <Box>

                        <FormControl margin={'normal'} fullWidth={true}>
                            <InputLabel>Select Session</InputLabel>
                            <Select
                                label={'Select Session'}
                                onChange={(event) => setSelectedSession(event.target.value)}
                            >
                                {sessions.map((session, index) => (
                                    <MenuItem value={session.id} key={index}>
                                        {session.name}
                                    </MenuItem>
                                ))
                                }
                            </Select>
                        </FormControl>

                        <FormControl margin={'normal'} fullWidth={true}>
                            <InputLabel>Select Semester</InputLabel>
                            <Select
                                label={'Select Semester'}
                                onChange={(event) => setSelectedSemester(event.target.value)}
                            >
                                {semesters.map((semester, index) => (
                                    <MenuItem value={semester.id} key={index}>
                                        {semester.name}
                                    </MenuItem>
                                ))
                                }
                            </Select>
                        </FormControl>

                        <Button onClick={getStudents} disabled={!selectedSession || !selectedSemester}
                                variant={'contained'}>Get Students</Button>

                    </Box>
                </Box>
            </Grid>

            <Grid item lg={6}>
                <Box component={Paper} p={1}>

                    <Typography variant={'h5'}>Promoted To</Typography>
                    <Box>

                        <FormControl margin={'normal'} fullWidth={true}>
                            <InputLabel>Select Session</InputLabel>
                            <Select
                                label={'Select Session'}
                                onChange={(event) => setSelectedSessionTo(event.target.value)}
                            >
                                {sessions.map((session, index) => (
                                    <MenuItem value={session.id} key={index}>
                                        {session.name}
                                    </MenuItem>
                                ))
                                }
                            </Select>
                        </FormControl>


                        <FormControl margin={'normal'} fullWidth={true}>
                            <InputLabel>Select Semester</InputLabel>
                            <Select
                                label={'Select Semester'}
                                onChange={(event) => setSelectedSemesterTo(event.target.value)}
                            >
                                {semesters.map((semester, index) => (
                                    <MenuItem value={semester.id} key={index}>
                                        {semester.name}
                                    </MenuItem>
                                ))
                                }
                            </Select>
                        </FormControl>

                        <Button onClick={promote} disabled={!selectedSessionTo || !selectedSemesterTo}
                                variant={'contained'}>Promote</Button>

                    </Box>
                </Box>
            </Grid>
        </Grid>

        <Box my={1} p={2} sx={{backgroundColor: '#ced5d9'}}>
            {selectedStudents.length} students selected
        </Box>

        {
            students.length > 0 &&

            <Box height={'400px'} my={2}>
                <DataGrid columns={columns}
                          rows={students}
                          checkboxSelection={true}
                          onSelectionModelChange={onRowSelect}
                          hideFooter={true}

                />

            </Box>

        }

    </div>

}


export default Promotion;
