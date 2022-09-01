import React from 'react'
import {
    Avatar,
    Box,
    Button, Card, CardActionArea, CardActions, CardHeader, Chip,
    Dialog,
    DialogContent,
    Divider, IconButton,
    InputBase,
    List,
    ListItem, Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {CustomDialogTitle} from "../../components/MuiCustom/CustomDialogTitle";
import {Close, FileUploadOutlined} from "@mui/icons-material";

import ReactQuill from 'react-quill';
import {useForm, Controller} from "react-hook-form";
import axios from "axios";
import {useParams, Link} from "react-router-dom";
import moment from "moment";

function QuestionAndAnswers() {

    let [openDialog, setOpenDialog] = React.useState(false);

    const [loading, setLoading] = React.useState(true);

    const [questions, setQuestions] = React.useState([]);

    let {id} = useParams();

    React.useEffect(() => {
        axios.get(`/q?type=group&typeId=${id}`)
            .then(res => {
                let {results} = res.data;
                setQuestions(results);
                setLoading(false);
            }).catch(er => console.log(er))
    }, []);

    if (loading) {
        return <div>loading...</div>
    }

    return (
        <div>
            <Stack my={1} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <Typography variant={'h3'}>Questions</Typography>
                <Button variant={'contained'} component={Link} to={`/g/${id}/q/ask`}>Ask Question</Button>
            </Stack>

            {
                questions.map((q, index) => (

                    <Card my={2} key={index}>
                        <CardHeader
                            title={<Typography color={'primary'} component={Link} to={`/g/${id}/q/${q.id}`} textTransform={'capitalize'} variant={'h5'}>{q.title}</Typography>}/>
                        <CardActions sx={{gap: 3}}>
                            <Chip label={q.user.firstName+ ' '+q.user.lastName} variant="outlined" avatar={<Avatar>F</Avatar>} />
                            <Typography>{moment(q.createdAt).fromNow()}</Typography>
                            <Typography>2 Answers </Typography>
                        </CardActions>
                    </Card>


                ))
            }

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}
                    maxWidth={'sm'} fullWidth={true}
            >
                <CustomDialogTitle onClose={() => setOpenDialog(false)}>
                    <Typography variant={'h4'}>Create Post</Typography>
                    <Divider/>
                </CustomDialogTitle>
                <DialogContent>

                </DialogContent>
            </Dialog>

        </div>
    )
}

export default QuestionAndAnswers;