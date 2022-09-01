import React from 'react'
import {
    Box,
    Button,
    IconButton,
    Stack,
    TextField,
    Typography,
    Paper,
    Card,
    CardHeader,
    CardActions, Chip, Avatar
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import ReactQuill from "react-quill";
import {FileUploadOutlined} from "@mui/icons-material";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import moment from "moment";

function AskQuestion() {

    let {control, handleSubmit, reset} = useForm();

    const {id} = useParams();

    const [loading, setLoading] = React.useState(true);

    const [questions, setQuestions] = React.useState([]);

    const submitQuestion = (data) => {

        axios.post(`/q`, {...data, type: 'group', typeId: id})
            .then(res => {
                let {status} = res.data;

                if(status === 'success'){
                    toast.success('Question Posted');
                    reset({});
                    fetchQuestions();
                }

            }).catch(er => console.log(er))

        console.log('data', data);

    }

    const fetchQuestions = () =>{
        axios.get(`/q?type=group&typeId=${id}&ref=my`)
            .then(res=> {
                let {results} = res.data;
                setQuestions(results);
                setLoading(false);
            }).catch(er=>console.log(er));
    }

    React.useEffect(()=> {
        fetchQuestions();
    }, []);

    const modules = {
        toolbar: [
            [{header: [1, 2, 3, 4, 5, 6, false]}],
            ["bold", "italic"],
            [{color: []}],
            ["blockquote", "code-block"],
            [{list: "ordered"}, {list: "bullet"}],
            ["link"],
        ],
    };

    if(loading){
        return <div>loading..</div>
    }

    return (
        <div>
            <Typography my={2} variant={'h4'}>Ask Your Questions</Typography>

            <Box p={2} component={Paper}>
                <form onSubmit={handleSubmit(submitQuestion)}>
                    <Controller render={({field: {value, onChange}}) => (
                        <TextField
                            label={'Title'}
                            onChange={(event) => onChange(event.target.value)}
                            value={value}
                            variant={'filled'}
                            multiline={true}
                            maxRows={2}
                            fullWidth={true}
                        />
                    )} name={'title'} control={control}


                    />

                    <Typography py={1}>Description</Typography>

                    <Controller render={({field: {value, onChange}}) => (
                        <ReactQuill modules={modules} value={value} theme="snow" onChange={onChange}/>
                    )} name={'description'} control={control}/>


                    <Box>
                        <Button type={'submit'} sx={{ml: 'auto'}}
                                variant={'contained'}>Post</Button>
                    </Box>


                </form>
            </Box>

            <Box my={3}>
                <Typography my={1} variant={'h4'}>Your Questions</Typography>

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

            </Box>



        </div>
    )

}

export default AskQuestion;