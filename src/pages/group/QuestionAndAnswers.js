import React from 'react'
import {
    Avatar,
    Box,
    Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Chip,
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
import {useParams, Link, useLocation} from "react-router-dom";
import moment from "moment";
import {queryParams} from "../../utils/queryParams";

function QuestionAndAnswers() {

    let [openDialog, setOpenDialog] = React.useState(false);

    const [loading, setLoading] = React.useState(true);

    const [questions, setQuestions] = React.useState([]);

    let {id} = useParams();

    const tag = queryParams(window.location.href, 'tag');


    React.useEffect(() => {

        let url = `/q?type=group&typeId=${id}`;

        if (tag.length) {
            url += `&tag=${tag}`;
        }

        axios.get(url)
            .then(res => {
                let {data, pagination} = res.data;
                setQuestions(data);
                setLoading(false);
            }).catch(er => console.log(er))

    }, [tag]);

    if (loading) {
        return <div>loading...</div>
    }

    return (
        <div>
            <Stack my={1} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <Typography variant={'h3'}>Questions {tag.length ? `(Tagged with ${tag})`:null}</Typography>
                <Button variant={'contained'} component={Link} to={`/g/${id}/q/ask`}>Ask Question</Button>
            </Stack>

            {
                questions.map((q, index) => (

                    <Card sx={{my: 2}} key={index}>

                        <CardContent>

                            <Typography color={'primary'} component={Link} to={`/g/${id}/q/${q.id}`}
                                        textTransform={'capitalize'} variant={'h5'}>{q.title}</Typography>

                            <Stack mt={2} direction={'row'} gap={1}>

                                {
                                    q.tags.map((tag, index) => (
                                        <Button component={Link} to={`/g/${id}/q?tag=${tag.slug}`} key={index}
                                                variant="contained"> {tag.name} </Button>
                                    ))
                                }

                            </Stack>

                        </CardContent>
                        <CardActions sx={{gap: 3}}>
                            <Chip label={q.user.firstName + ' ' + q.user.lastName} variant="outlined"
                                  avatar={<Avatar>F</Avatar>}/>
                            <Typography>{moment(q.createdAt).fromNow()}</Typography>
                            <Typography>{q.count} Answers</Typography>
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