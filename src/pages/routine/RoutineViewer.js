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

export default function RoutineViewer() {

    const [showModal, setShowModal] = React.useState(false);

    const [loading, setLoading] = React.useState(true);

    //grouped

    const [groupBySemesterWithClass, setGroupBySemesterWithClass] = React.useState([]);

    //select
    const [selectedClass, setSelectedClass] = React.useState(null);


    //times

    const [times, setTimes] = React.useState([]);

    //router

    let {id} = useParams();

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

    const {register, handleSubmit, control, reset, formState: {errors}} = useForm({
        defaultValues: {
            course: null,
            teacher: null,
            times: [{day: "", id: '', startTime: null, periods: ''}]
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

    const fetchData = async () => {


        let min = moment('8:00', 'HH:mm'); //moment.min(moments);
        let max = moment('17:00', 'HH:mm'); //moment.max(moments);


        let times = [];

        for (let start = min; moment(max).diff(moment(start), 'minutes') >= 0; start = moment(start).add(60, 'minutes')) {
            times.push(start.format('hh:mm A'));
        }

        setTimes(times);

        setLoading(true);

        let res = await axios.get(`/routines/${id}`);

        let data = res.data;

        //group by semester

        let groupBySemesters = _.groupBy(data, 'semesterName');

        //
        let classGroupBySemesters = [];

        for (let semester of Object.keys(groupBySemesters)) {
            let object = {};
            let allCoursesForThisSemester = groupBySemesters[semester];
            let groupByClass = _.groupBy(allCoursesForThisSemester, 'courseCode');

            object.semesterName = semester;
            object.groupByClass = groupByClass;
            // classGroupBySemesters.push(object);

            const arr = new Array(6).fill(0).map(() => new Array(times.length).fill(0));

            let count = 0;

            for (let classCode of Object.keys(groupByClass)) {
                let color = getRandomColor();
                for (let classTime of groupByClass[classCode]) {
                    let dayIndex = days.findIndex(item => item.value === classTime.day);
                    let timeIndex = times.findIndex((item) => moment(item, 'HH:mm A').isSame(moment(classTime.startTime, 'HH:mm:ss')));
                    classTime.color = color; // colors[count];
                    arr[dayIndex][timeIndex] = classTime;
                    if (classTime.periods > 1) {
                        for (let i = 1; i < classTime.periods; i++) {
                            arr[dayIndex][timeIndex + i] = {isSpanned: true, ...classTime};
                        }
                    }
                }
                count++;
            }

            object.classes = arr;

            classGroupBySemesters.push(object);
        }


        setLoading(false);

        setGroupBySemesterWithClass(classGroupBySemesters);
    }

    React.useEffect(() => {
        fetchData();
    }, []);


    const getRandomColor = () => `hsla(${Math.random() * 360}, 100%, 70%, 1)`;

    const addClass = (data) => {

        // let {times} = data;

        data.times = data.times.map(time => {
            let tt = {};
            tt.startTime = moment(time.startTime, 'hh:mm A').format("HH:mm:ss");
            tt.periods = time.periods;
            tt.day = time.day;
            if (selectedClass) {
                tt.id = time.id;
            }
            return tt;
        });

        let {times, course, teacher} = data;

        let d = {times, courseId: course.id, teacherId: teacher.id}

        if (selectedClass) {
            axios.put(`/routines/${id}/classes/${selectedClass}`, d)
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
            axios.post(`/routines/${id}/classes`, d)
                .then(res => {
                    let {status} = res.data;
                    if (status === 'success') {
                        toast.success('class added');
                        reset({});
                        fetchData();
                        setShowModal(false);
                    }

                }).catch(er => console.log(er));
        }
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
    }, {
        label: 'FRI',
        value: 'fri'
    }];


    const isTimeError = (field, index, message) => {

        if (errors && errors.times && errors.times[index] && errors.times[index][field]) {
            return message;
        }
    }

    const selectAndOpen = (classes, time) => {
        let {courseCode} = time;

        let cls = classes[courseCode];

        let times = cls.map((cls) => {
            let tt = {};
            tt.startTime = moment(cls.startTime, 'HH:mm:ss').format('hh:mm A');
            tt.day = cls.day;
            tt.periods = cls.periods;
            tt.id = cls.classTimeId;
            return tt;
        });

        reset({
            times,
            teacher: {
                id: cls[0].teacherId, firstName: cls[0].teacherFirstName,
                lastName: cls[0].teacherLastName,
            },
            course: {id: cls[0].courseId, name: cls[0].courseName, courseCode: cls[0].courseCode}
        });
        setSelectedClass(cls[0].id);
        setShowModal(true);
    }

    //Todo fetch routine data along teacherId and courseId for update

    if (loading) {
        return <p>loading</p>
    }

    return (
        <div>
            <div className={'flex justify-between items-center'}>
                <Typography variant={'h3'}>
                    Routine
                </Typography>
                <div>
                    <Button onClick={() => setShowModal(true)}>Add Class</Button>
                </div>
            </div>

            {
                groupBySemesterWithClass.map((semester, index) => (

                    <Accordion key={'acc' + index}>
                        <AccordionSummary
                            expandIcon={<Expand/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>{semester.semesterName}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Days</TableCell>
                                            {times.map((item, index) => (
                                                <TableCell key={'times' + index}>
                                                    {item}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {semester.classes.map((day, index) => (
                                            <TableRow key={index}>
                                                <TableCell key={'day' + index}>{days[index].label}</TableCell>
                                                {day.map((time, tIndex) => (

                                                    !time.isSpanned &&

                                                    <TableCell key={tIndex} align={'center'}
                                                               colSpan={time.periods}
                                                               onClick={() => selectAndOpen(semester.groupByClass, time)}
                                                               sx={{
                                                                   bgcolor: time.color,
                                                                   cursor: 'pointer'
                                                               }}>{time.courseName}</TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                        }
                                    </TableBody>

                                </Table>
                            </TableContainer>
                        </AccordionDetails>
                    </Accordion>
                ))
            }


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
                                            onSelect={(value) => onChange(value)}
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

                                                />

                                                <FormHelperText error={!!errors?.teacher}>
                                                    {errors.teacher?.message}
                                                </FormHelperText>
                                            </FormControl>
                                        )}

                            />


                            <Box sx={{
                                my: 2,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Typography>Class Times</Typography>
                                <IconButton
                                    onClick={() => append({
                                        id: null,
                                        day: '',
                                        startTime: null,
                                        periods: ''
                                    })}>
                                    <Add/>
                                </IconButton>
                            </Box>


                            {
                                fields.map((classTime, index) => (
                                    <div key={index}>

                                        <Divider sx={{my: 2}}>
                                            <Chip label={'Class ' + (index + 1)}/>
                                        </Divider>

                                        <Grid alignItems={'center'} container>

                                            <Grid xs={6} lg={6} item>

                                                <input type={'hidden'} {...register(`times[${index}].id`)}/>

                                                <Controller
                                                    render={({field}) =>
                                                        <FormControl fullWidth={true} margin={"dense"}>
                                                            <InputLabel>Days*</InputLabel>
                                                            <Select
                                                                label={'Days'}
                                                                fullWidth={true}
                                                                {...field}
                                                            >
                                                                {days.map((option) => (
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
                            <Stack direction={'row'} spacing={5} justifyContent={'center'}>
                                <Button variant={'contained'} type={'submit'}>Submit</Button>
                                <Button variant={'contained'} type={'submit'}>Delete!</Button>
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