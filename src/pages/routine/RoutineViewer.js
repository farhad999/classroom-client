import React from 'react'
import axios from "axios";
import {useForm, Controller, useFieldArray} from "react-hook-form";
import {useParams} from "react-router-dom";
import {
    Accordion, AccordionDetails, AccordionSummary,
    Box,
    Button, Chip,
    Dialog,
    DialogContent,
    Divider,
    FormControl, FormHelperText, Grid, IconButton,
    InputLabel,
    MenuItem, OutlinedInput, Paper,
    Select, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField,
    Typography
} from "@mui/material";
import CustomAutoComplete from "../../components/MuiCustom/CustomAutoComplete";
import {CustomDialogTitle} from "../../components/MuiCustom/CustomDialogTitle";
import {Add, Expand} from "@mui/icons-material";
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import Stack from '@mui/material/Stack';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import {MobileTimePicker} from "@mui/x-date-pickers";
import * as yup from 'yup'
import {yupResolver} from "@hookform/resolvers/yup";
import moment from "moment";
import {DataGrid} from "@mui/x-data-grid";
import {toast} from "react-toastify";
import * as _ from 'lodash'
import {useSelector} from "react-redux";

export default function RoutineViewer() {

    const [showModal, setShowModal] = React.useState(false);

    const [loading, setLoading] = React.useState(true);

    //select
    const [selectedClass, setSelectedClass] = React.useState(null);

    const [selectedClassTime, setSelectedClassTime] = React.useState(null);

    //times

    const [times, setTimes] = React.useState([]);

    const [routine, setRoutine] = React.useState(null);

    const [routineDays, setRoutineDays] = React.useState([]);

    const [classes, setClasses] = React.useState([]);

    //router

    let {id} = useParams();

    //user

    let {user} = useSelector(state => state.auth);

    const [mode, setMode] = React.useState('read');

    //schema

    let formSchema = yup.object().shape({
        course: yup.object().shape({
            id: yup.string(),
            name: yup.string(),
        }),
        teacher: yup.object().shape({
            id: yup.string(),
            firstName: yup.string(),
            lastName: yup.string(),
        }),
        times: yup.array().of(
            yup.object().shape(
                {
                    id: yup.string(),
                    startTime: yup.string().required(),
                    day: yup.string().required(),
                    periods: yup.string().required(),
                }))
    });

    //form

    const {register, handleSubmit, control, reset, getValues, formState: {errors}} = useForm({
        defaultValues: {
            course: null,
            teacher: user.userType === 'teacher' ? {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
            } : null,
            times: [{day: "", startTime: null, periods: ''}]
        },
        resolver: yupResolver(formSchema)
    });

    const {fields, append, remove} = useFieldArray({
        control,
        name: 'times',
        defaultValues: {
            ['times']: []
        }
    });

    let colors = ['#1234ff', '#dd54ff', '#ff9912', '#dd0023', '#fdfd12', '#aa11ff'];

    const availableSemesters = ['1-1', '2-1', '3-1', '4-1'];

    const fetchData = async () => {

        let times = [];

        setLoading(true);

        //async get data

        let res = await axios.get(`/routines/${id}`);

        let {routine, classes} = res.data;

        setRoutine(routine);

        let min = moment(routine.startTime, 'HH:mm:ss');
        let max = moment(routine.endTime, 'HH:mm:ss');

        let breakTime = routine.breakTime.split('-');

        let breakStartTime = moment(breakTime[0], 'HH:mm');

        let breakEndTime = moment(breakTime[1], 'HH:mm');

        for (let start = min; moment(breakStartTime).diff(moment(start), 'minutes') >= 0; start = moment(start).add(60, 'minutes')) {
            times.push(start.format('hh:mmA'));
        }

        for (let start = breakEndTime; moment(max).diff(moment(start), 'minutes') >= 60; start = moment(start).add(60, 'minutes')) {
            times.push(start.format('hh:mmA'));
        }

        setTimes(times);

        const routineDays = days.filter(item => {

            let offDays = routine.offDays.split(',');
            return !offDays.includes(item.value);
        })

        setRoutineDays(routineDays);

        //main array

        const arr = new Array(routineDays.length).fill(0).map(() => new Array(availableSemesters.length).fill(0).map(() => new Array(times.length).fill(0)));

        //classes are grouped into days

        let groupByDays = _.groupBy(classes, 'day');

        for (let day of Object.keys(groupByDays)) {

            let object = {};

            let allCoursesForThisDay = groupByDays[day];

            //classes for a day into semester groups

            let groupBySemester = _.groupBy(allCoursesForThisDay, 'shortName');

            // object.semesterName = semester;
            //  object.groupByClass = groupByClass;
            // classGroupBySemesters.push(object);

            //  const arr = new Array(6).fill(0).map(() => new Array(times.length).fill(0));

            let count = 0;

            for (let semesterShortName of Object.keys(groupBySemester)) {

                let color = getRandomColor();

                let classesForEachSemester = groupBySemester[semesterShortName];


                for (let classTime of classesForEachSemester) {

                    console.log('classTime', classTime);

                    let semesterIndex = availableSemesters.findIndex(item => item === classTime.shortName);

                    console.log('semester index', semesterIndex);

                    let dayIndex = routineDays.findIndex(item => item.value === classTime.day);
                    let timeIndex = times.findIndex((item) => moment(item, 'HH:mm A').isSame(moment(classTime.startTime, 'HH:mm:ss')));
                    // classTime.color = color; // colors[count];
                    //currently do not show that
                    if (semesterIndex >= 0) {
                        arr[dayIndex][semesterIndex][timeIndex] = classTime;
                    }

                    if (classTime.periods > 1) {
                        for (let i = 0; i < classTime.periods; i++) {
                            if (i === 0) {
                                arr[dayIndex][semesterIndex][timeIndex] = {isSpanable: true, ...classTime};
                            } else {
                                arr[dayIndex][semesterIndex][timeIndex + i] = {spanned: true};
                            }

                        }
                    }
                }
                count++;
            }

        }
        setLoading(false);

        setClasses(arr);

        console.log('array', arr);
    }

    React.useEffect(() => {
        fetchData();
    }, []);


    const getRandomColor = () => `hsla(${Math.random() * 360}, 100%, 70%, 1)`;

    const addClass = (data) => {

        // let {times} = data;

        console.log('data', data);

        data.times = data.times.map(time => {
            let tt = {};
            tt.startTime = moment(time.startTime, 'hh:mm A').format("HH:mm:ss");
            tt.periods = time.periods;
            tt.day = time.day;
            if (selectedClass) {
                tt.id = selectedClass.classTimeId;
                console.log('class is selected');

            }
            return tt;
        });

        let {times, course, teacher} = data;

        console.log('times', times);

        let d = {times, courseId: course.id, teacherId: teacher.id}

        if (selectedClass) {
            d.id = selectedClass.id;
        }

        axios.post(`/routines/${id}/classes`, d)
            .then(res => {
                let {status, message} = res.data;
                if (status === 'success') {
                    toast.success(message);
                    reset({});
                    fetchData();
                    setShowModal(false);
                }
                if (status === 'failed') {
                    toast.error(message);
                }

            }).catch(er => console.log(er));

        /*if (selectedClass) {

            let updatedData = {time: times[0], courseId: course.id, teacherId: teacher.id};

            axios.put(`/routines/${id}/classes/${selectedClass}`, updatedData)
                .then(res => {
                    console.log('res', res);
                    let {status} = res.data;
                    if (status === 'success') {
                        toast.success('class updated');
                        reset({});
                        fetchData();
                        setShowModal(false);
                    }

                }).catch(er => console.log(er));
        } else {

        }*/
    }

    const days = [{
        label: 'SAT',
        value: 'sat',
    }, {
        label: 'SUN',
        value: 'sun'
    }, {
        label: 'MON',
        value: 'mon'
    }, {
        label: 'TUE',
        value: 'tue'
    }, {
        label: 'WED',
        value: 'wed'
    }, {
        label: 'THU',
        value: 'thu',
    }];


    const isTimeError = (field, index, message) => {

        if (errors && errors.times && errors.times[index] && errors.times[index][field]) {
            return message;
        }
    }

    const selectAndOpen = (cls) => {

        console.log('cls', cls);

        if (user.userType === 'teacher' && user.id === cls.teacherId) {
            setMode('write');
        }

        reset({
            times: [{
                startTime: moment(cls.startTime, 'HH:mm:ss').format('hh:mmA'),
                day: cls.day,
                periods: cls.periods,
                id: cls.classTimeId
            }],
            teacher: {
                id: cls.teacherId, firstName: cls.teacherFirstName,
                lastName: cls.teacherLastName,
            },
            course: {id: cls.courseId, name: cls.courseName, courseCode: cls.courseCode}
        });
        setSelectedClass(cls);
        setShowModal(true);
    }

    const openAddClassModal = (day, sem, clsIndex) => {

        let startTime = times[clsIndex];

        reset({
            times: [{day: day.value, id: '', startTime, periods: 1}],
            teacher: user.userType === 'teacher' ? {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
            } : null,
            course: null,
        });
        setSelectedClass(null);
        setShowModal(true);
    }

    if (loading) {
        return <p>loading</p>
    }

    function onSelectCourse(value, onChange) {
        onChange(value);
        console.log('value', value);
        axios.get(`/routines/${id}/${value.id}`)
            .then(res => {

                let {teacherId, firstName, lastName} = res.data;

                reset({...getValues(), teacher: {id: teacherId, firstName, lastName}});

            }).catch(er => console.log(er));
        //find the course teacher of this class if possible
    }

    function enableOverride() {

        setMode('override');

        reset({
            ...getValues(), teacher: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName
            },
            course: null,
        });

        //todo find a way to reset specific field
    }

    console.log('errors', errors)

    return (
        <div>
            <div className={'flex justify-between items-center'}>
                <Typography variant={'h3'}>
                    Routine
                </Typography>
                <div>
                    <Button onClick={openAddClassModal}>Add Class</Button>
                </div>
            </div>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Days</TableCell>
                        <TableCell>Sem</TableCell>
                        {times.map((item, index) => (
                            <TableCell key={'times' + index}>
                                {item}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>

                    {routineDays.map((day, dayIndex) => (

                        routine.semesters.map((sem, index) => (
                            <TableRow>
                                {index === 0 &&
                                    <TableCell rowSpan={4}>{day.label}</TableCell>
                                }
                                <TableCell>
                                    {sem.shortName}
                                </TableCell>
                                {classes[dayIndex][index].map((cls, clsIndex) => {

                                    return cls === 0 ? <TableCell>

                                            {times[clsIndex] == moment(routine.breakTime.split('-')[0], 'HH:mm').format('hh:mmA') ?
                                                <Typography>
                                                    Break
                                                </Typography>
                                                :
                                                <IconButton onClick={() => openAddClassModal(day, sem, clsIndex)}>
                                                    <Add/>
                                                </IconButton>
                                            }

                                        </TableCell>
                                        :

                                        !cls.spanned &&
                                        <TableCell
                                            colSpan={cls.isSpanable && cls.periods}
                                            onClick={() => selectAndOpen(cls)} sx={{
                                            cursor: 'pointer',
                                            textAlign: 'center'
                                        }}>
                                            {cls.courseCode}
                                        </TableCell>


                                })}
                            </TableRow>
                        ))

                    ))
                    }


                </TableBody>
            </Table>

            <LocalizationProvider dateAdapter={AdapterMoment}>

                <Dialog open={showModal} onClose={() => setShowModal(false)}
                        maxWidth={'xs'} fullWidth={true}
                        fullScreen={true} scroll={"body"}
                >
                    <CustomDialogTitle onClose={() => setShowModal(false)}>
                        <Typography variant={'h4'}>Add Class</Typography>
                    </CustomDialogTitle>

                    <DialogContent>

                        <form onSubmit={handleSubmit(addClass)}>

                            <Controller
                                render={({field: {value, onChange}}) =>

                                    <FormControl margin={'normal'} fullWidth={true}>

                                        <CustomAutoComplete
                                            {...register('course')}
                                            value={value}
                                            url={'/courses?q='}
                                            onSelect={(value) => onSelectCourse(value, onChange)}
                                            inputLabel={'Select Course'}
                                            setOptionLabel={(option) => `${option.name}(${option.courseCode})`}

                                        />
                                        <FormHelperText error={!!errors?.course}>
                                            {errors.course?.message}
                                        </FormHelperText>
                                    </FormControl>
                                }
                                name={`course`}
                                control={control}
                            />

                            <Controller name={'teacher'}
                                        control={control}
                                        render={({field: {onChange, value}}) => (
                                            <FormControl margin={'normal'} fullWidth={true}>

                                                <CustomAutoComplete
                                                    url={'/users?type=teacher&q='}
                                                    value={value}
                                                    onSelect={(value) => onChange(value)}
                                                    inputLabel={'Select Teacher'}
                                                    setOptionLabel={(option) => option.firstName + " " + option.lastName}
                                                    disabled={user.userType === 'teacher'}
                                                />

                                                <FormHelperText error={!!errors?.teacher}>
                                                    {errors.teacher?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        )}

                            />

                            {
                                !selectedClass &&


                                <Box sx={{
                                    my: 2,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Typography>Class Times</Typography>
                                    <IconButton
                                        onClick={() => append({
                                            day: '',
                                            startTime: null,
                                            periods: ''
                                        })}>
                                        <Add/>
                                    </IconButton>
                                </Box>

                            }


                            {
                                fields.map((classTime, index) => (
                                    <div key={index}>

                                        <Divider sx={{my: 2}}>
                                            <Chip label={'Class ' + (index + 1)}/>
                                        </Divider>

                                        <Grid alignItems={'center'} container>

                                            <Grid xs={6} lg={6} item>

                                                <Controller
                                                    render={({field}) =>
                                                        <FormControl fullWidth={true} margin={"dense"}>
                                                            <InputLabel>Days*</InputLabel>
                                                            <Select
                                                                label={'Days'}
                                                                fullWidth={true}
                                                                {...field}
                                                            >
                                                                {routineDays.map((option) => (
                                                                    <MenuItem key={option.value}
                                                                              value={option.value}>{option.label}</MenuItem>
                                                                ))}
                                                            </Select>
                                                            <FormHelperText error={true}>
                                                                {isTimeError('day', index, 'Day is a required field')}
                                                            </FormHelperText>
                                                        </FormControl>
                                                    }
                                                    name={`times[${index}].day`}
                                                    control={control}
                                                />

                                            </Grid>

                                            <Grid xs={6} lg={6} item>

                                                <Controller name={`times[${index}].startTime`}
                                                            control={control}
                                                            render={({field}) => (
                                                                <FormControl fullWidth={true} margin={"dense"}>
                                                                    <InputLabel>Time*</InputLabel>
                                                                    <Select
                                                                        label={'Time'}
                                                                        {...field}>
                                                                        {times.map((time => (
                                                                            <MenuItem key={'k' + time}
                                                                                      value={time}>{time}</MenuItem>
                                                                        )))}
                                                                    </Select>
                                                                    <FormHelperText error={true}>
                                                                        {isTimeError('startTime', index, 'Day is a required field')}
                                                                    </FormHelperText>
                                                                </FormControl>

                                                            )}

                                                />

                                            </Grid>

                                        </Grid>


                                        <Controller render={({field}) => (
                                            <FormControl fullWidth={true} margin={'dense'}>
                                                <InputLabel>Periods*</InputLabel>
                                                <Select
                                                    label={'Periods'}
                                                    {...field}
                                                >
                                                    <MenuItem value={1}>1</MenuItem>
                                                    <MenuItem value={2}>2</MenuItem>
                                                    <MenuItem value={3}>3</MenuItem>
                                                    <MenuItem value={4}>4</MenuItem>
                                                </Select>

                                                <FormHelperText error={true}>
                                                    {isTimeError('periods', index, 'Period is a required')}
                                                </FormHelperText>

                                            </FormControl>

                                        )} control={control} name={`times[${index}].periods`}

                                        />


                                        <Button onClick={() => remove(index)}>Remove</Button>


                                    </div>
                                ))
                            }

                            {
                                (user.userType === 'teacher' && selectedClass) &&


                                <Box>
                                    <h3>You can override this class</h3>
                                    <Button onClick={enableOverride}>click to override</Button>
                                </Box>

                            }

                            <Stack direction={'row'} spacing={5} justifyContent={'center'}>
                                <Button variant={'contained'} type={'submit'}>Submit</Button>
                            </Stack>


                        </form>
                    </DialogContent>


                </Dialog>
            </LocalizationProvider>

            {
                //Class Info dialog
            }

        </div>
    )

}