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
    CardActions, Chip, Avatar, Autocomplete, createFilterOptions, CardContent
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import ReactQuill from "react-quill";
import {Add, FileUploadOutlined} from "@mui/icons-material";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import moment from "moment";

const filter = createFilterOptions();

function AskQuestion() {

    let {control, handleSubmit, reset} = useForm();

    const {id} = useParams();

    const [loading, setLoading] = React.useState(true);

    const [questions, setQuestions] = React.useState([]);

    const tags = [];

    const [value, setValue] = React.useState("");

    const submitQuestion = (data) => {

        axios.post(`/q`, {...data, type: 'group', typeId: id})
            .then(res => {
                let {status} = res.data;

                if (status === 'success') {
                    toast.success('Question Posted');
                    reset({});
                    fetchQuestions();
                }

            }).catch(er => console.log(er))

        console.log('data', data);

    }

    const fetchQuestions = () => {
        axios.get(`/q?type=group&typeId=${id}&ref=my`)
            .then(res => {
                const {data, pagination} = res.data;
                setQuestions(data);
                setLoading(false);
            }).catch(er => console.log(er));
    }

    React.useEffect(() => {
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

    if (loading) {
        return <div>loading..</div>
    }

    const convertToSlug = (text) => {
        return text.toLowerCase()
            .replace(/ /g, '-');
    }

    return (
        <div>
            <Typography my={2} variant={'h4'}>Ask Your Questions</Typography>

            <Box p={2} component={Paper}>
                <form onSubmit={handleSubmit(submitQuestion)}>
                    <Box my={1}>
                        <Controller render={({field: {value, onChange}}) => (
                            <TextField
                                label={'Title'}
                                onChange={(event) => onChange(event.target.value)}
                                value={value}
                                variant={'outlined'}
                                multiline={true}
                                maxRows={2}
                                fullWidth={true}
                            />
                        )} name={'title'} control={control}
                        />
                    </Box>

                    <Box my={1}>

                        <Controller render={({field: {value, onChange}})=> (
                            <Autocomplete
                                multiple
                                options={tags}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, values) => {

                                    if (values.length) {

                                        let lastItem = values[values.length - 1];

                                        if (lastItem.type === 'add') {

                                            let label = lastItem.name;
                                            //remove Add and quotes
                                            label = label.slice(4).slice(1, -1);

                                            lastItem.name = label;

                                            delete lastItem.type;
                                        }
                                        console.log('values', values);
                                    }
                                    onChange(values);
                                }}
                                filterOptions={(options, params) => {

                                    const filtered = filter(options, params);

                                    const {inputValue} = params;

                                    // Suggest the creation of a new value
                                    const isExisting = options.some((option) => inputValue === option.label);
                                    if (inputValue !== '' && !isExisting) {
                                        filtered.push({
                                            slug: convertToSlug(inputValue),
                                            name: `Add "${inputValue}"`,
                                            type: 'add'
                                        });
                                    }

                                    return filtered;
                                }}
                                freeSolo
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        onChange={(event) => setValue(event.target.value)}
                                        variant="outlined"
                                        label="Tags"
                                        placeholder="Add Tag"
                                    />
                                )}
                            />
                        )} name={'tags'} control={control} />


                    </Box>

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

                            <CardContent>
                                <Typography color={'primary'} component={Link} to={`/g/${id}/q/${q.id}`}
                                            textTransform={'capitalize'} variant={'h5'}>{q.title}</Typography>

                                <Stack mt={2} direction={'row'} gap={1} >

                                    {
                                        q.tags.map((tag, index) => (
                                            <Button key={index} variant="contained"> {tag.name} </Button>
                                        ))
                                    }

                                </Stack>
                            </CardContent>

                            <CardActions sx={{gap: 3}}>
                                <Chip label={q.user.firstName + ' ' + q.user.lastName} variant="outlined"
                                      avatar={<Avatar>F</Avatar>}/>
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