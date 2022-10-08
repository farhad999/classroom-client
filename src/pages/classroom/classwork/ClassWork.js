import React from 'react'
import {
    Button,
    Typography, Card, CardContent, Box
} from "@mui/material";
import axios from "axios";
import {useParams, Link} from "react-router-dom";
import moment from "moment";
import CreateOrUpdateAssignment from "../../../components/CreateOrUpdateAssignment";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import RenderIf from "../../../components/wrappers/RenderIf";
import {Add} from "@mui/icons-material";

function ClassWork(props) {

    const [openDialog, setOpenDialog] = React.useState(false);

    const [loading, setLoading] = React.useState(true);

    const [assignments, setAssignments] = React.useState([]);

    //classroom user

    const {user} = useSelector(state => state.classroom);

    //classId
    const {id} = useParams();


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
            <Box my={3} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant={'h4'}>Classworks</Typography>
                <RenderIf condition={user.isMainTeacher}>
                    <Button startIcon={<Add />} variant={'contained'} onClick={() => setOpenDialog(true)}>Create</Button>
                </RenderIf>
            </Box>



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
