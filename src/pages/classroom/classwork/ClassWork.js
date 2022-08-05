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
import FileUploader from "../../../components/FileUploader";
import axios from "axios";
import {useParams, Link} from "react-router-dom";
import moment from "moment";
import CreateOrUpdateAssignment from "../../../components/CreateOrUpdateAssignment";
import {toast} from "react-toastify";

function ClassWork(props) {

    const [openDialog, setOpenDialog] = React.useState(false);

    const [loading, setLoading] = React.useState(true);

    const [assignments, setAssignments] = React.useState([]);

    //create assignment

    const [uploads, setUploads] = React.useState([]);

    //let ref

    const uploadRef = React.useRef();

    //classId
    const {id} = useParams();

    const {control, handleSubmit} = useForm({
        defaultValues: {
            due: null,
            points: '',
        }
    });

    const fetchAssignment = () => {
        axios.get(`/c/${id}/assignments`)
            .then(res => {
                setAssignments(res.data);
                setLoading(false);
            }).catch(er => console.log(er));
    }

    React.useEffect(() => {
        fetchAssignment();
    }, []);


    function onSuccess() {
        setOpenDialog(false);
        toast.success('Assignment Added');
        fetchAssignment();
    }

    if (loading) {
        return <div>
            loading...
        </div>
    }


    return (
        <div>

            <Button onClick={() => setOpenDialog(true)}>Create</Button>

            {assignments.map((assignment, index) => (
                <Box key={'assign' + index} component={Link} to={`/c/${id}/w/${assignment.id}`}>
                    <Card sx={{my: 1}}>
                        <CardContent>
                            <Typography textTransform={'capitalize'} variant={'h5'}>{assignment.title}</Typography>
                            <Typography>Due: {assignment.due ? moment(assignment.due).format('MMMM DD') : 'No Due'}</Typography>
                        </CardContent>
                    </Card>
                </Box>

            ))}

            <CreateOrUpdateAssignment classId={id}
                                      onSuccess={onSuccess}
                                      openDialog={openDialog}
                                      closeDialog={() => setOpenDialog(false)}

            />

        </div>
    )
}

export default ClassWork;