import React from 'react'
import {
    AppBar,
    Button,
    Dialog,
    IconButton,
    Toolbar,
    Typography,
    Icon,
    DialogContent,
    Grid,
    TextField, Card, Stack, CardContent, FormControl, InputLabel, OutlinedInput, FilledInput, Box
} from "@mui/material";
import {Close, AssignmentOutlined, FileUploadOutlined} from '@mui/icons-material'
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {DateTimePicker, DesktopDatePicker, DesktopDateTimePicker} from "@mui/x-date-pickers";
import {useForm, Controller} from "react-hook-form";
import FileManager from "../../components/FileManager";
import axios from "axios";
import {useParams, Link} from "react-router-dom";
import moment from "moment";

function ClassWork(props) {

    const [openDialog, setOpenDialog] = React.useState(false);

    const [loading, setLoading] = React.useState(true);

    const [assignments, setAssignments] = React.useState([]);

    //classId
    const {id} = useParams();

    const {control, handleSubmit} = useForm({
        defaultValues: {
            due: null,
            points: '',
        }
    });

    React.useEffect(()=> {
        axios.get(`/c/${id}/assignments`)
            .then(res=> {
                setAssignments(res.data);
                setLoading(false);
            }).catch(er=>console.log(er));
    }, []);

    const createAssignment = (data) => {
        console.log('data', data);

        data.due = data.due && data.due.format('YYYY-MM-DD HH:mm:ss');

        axios.post(`/c/${id}/assignments`, data)
            .then(res=> {

            }).catch(er=>console.log(er))
    }

    if(loading){
        return <div>
            loading...
        </div>
    }

    return (
        <div>

            <Button onClick={() => setOpenDialog(true)}>Create</Button>

            {assignments.map((assignment)=> (
                <Box component={Link} to={`/c/${id}/w/${assignment.id}`}>
                    <Card sx={{my: 1}}>
                        <CardContent>
                            <Typography>{assignment.title}</Typography>
                            <Typography>Due: {assignment.due ? moment(assignment.due).format('MMMM DD'): 'No Due'}</Typography>
                        </CardContent>
                    </Card>
                </Box>

            ))}

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}
                    fullScreen={true}

            >
                <form onSubmit={handleSubmit(createAssignment)}>

                    <AppBar color={'transparent'} sx={{position: 'relative'}}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={() => setOpenDialog(false)}
                                aria-label="close"
                            >
                                <Close/>
                            </IconButton>

                            <Icon color={'primary'}>
                                <AssignmentOutlined/>
                            </Icon>

                            <Typography sx={{ml: 2, flex: 1}} variant="h4" component="div">
                                Assignment
                            </Typography>
                            <Button type={'submit'} autoFocus variant={'contained'}>
                                Save
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <DialogContent sx={{backgroundColor: '#efefef'}}>
                        <Grid container spacing={2}>

                            <Grid item sm={8}>
                                <Card>
                                    <CardContent>

                                        <Controller render={({field: {value, onChange}}) => (
                                            <TextField label={'Title'}
                                                       variant={'filled'}
                                                       value={value}
                                                       onChange={(event) => onChange(event.target.value)}
                                                       margin={'normal'} fullWidth={true}
                                            />
                                        )} name={'title'} control={control}/>


                                        <Controller render={({field: {value, onChange}}) => (
                                            <TextField label={'Description'} fullWidth={true}
                                                       margin={"normal"}
                                                       variant={'filled'}
                                                       multiline={true} rows={4} value={value}
                                                       onChange={(event) => onChange(event.target.value)}
                                            />
                                        )} name={'description'} control={control}/>


                                        <FileManager/>

                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item sm={4}>
                                <Card>
                                    <CardContent>

                                        <Typography>Points</Typography>

                                        <Controller render={({field: {value, onChange}}) => (
                                            <TextField label={'Points'} fullWidth={true} variant={'filled'}
                                                       margin={'normal'}
                                                       value={value} onChange={(event) => onChange(event.target.value)}
                                            />
                                        )} name={'points'} control={control}/>


                                        <LocalizationProvider dateAdapter={AdapterMoment}>

                                            <Controller render={({field: {value, onChange}}) => (
                                                <DateTimePicker
                                                    label={'Due Date'}
                                                    renderInput={(props) =>
                                                        <TextField {...props} fullWidth={true}
                                                                   margin={'normal'} variant={'filled'}
                                                        />}
                                                    onChange={(d) => {
                                                        onChange(d)
                                                    }}
                                                    value={value}
                                                />
                                            )} name={'due'} control={control}/>


                                        </LocalizationProvider>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </form>
            </Dialog>

        </div>
    )
}

export default ClassWork;