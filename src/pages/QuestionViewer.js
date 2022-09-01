import React from 'react'
import {useParams} from "react-router-dom";
import axios from "axios";
import {Avatar, Box, Button, Paper, Stack, Typography} from "@mui/material";
import ReactQuill from 'react-quill';
import moment from "moment";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";

function QuestionViewer() {

    let {qId} = useParams();
    const [loading, setLoading] = React.useState(true);
    const [question, setQuestion] = React.useState(null);
    const [answers, setAnswers] = React.useState([]);

    const [inputAnswer, setInputAnswer] = React.useState('');

    const {user} = useSelector(state => state.auth);

    React.useEffect(() => {
        axios.get(`/q/${qId}`)
            .then(res => {
                let {question, answers} = res.data;
                setQuestion(question);
                setAnswers(answers);
                setLoading(false);
            }).catch(er => console.log(er))
    }, []);

    const postAnswer = () => {
        axios.post(`/q/${qId}/answer`, {content: inputAnswer})
            .then(res => {
                let {status, id} = res.data;
                if (status === 'success') {
                    toast.success("Answer Posted");
                    setAnswers(prev => [...prev, {id, body: inputAnswer, userId: user.id, user, questionId: id}]);
                    setInputAnswer("");
                }
            }).catch(er => console.log(er))
    }

    if (loading) {
        return <div>loading...</div>
    }

    return (
        <div>


            <Box my={1}>
                <Typography textTransform={'capitalize'} variant={'h4'}>{question.title}</Typography>
                <Stack>
                    <Typography color={'primary'}
                                textTransform={'capitalize'}>{question.user.firstName + " " + question.user.lastName}</Typography>
                    <Typography variant={'body2'}>{moment(question.createdAt).fromNow()}</Typography>
                </Stack>

            </Box>


            <div dangerouslySetInnerHTML={{__html: question.description}}/>

            <Typography my={2} variant={'h4'}>Answers</Typography>

            {answers.map((ans, index) => (
                <Box my={2} p={2} component={Paper} key={index}>
                    <Stack gap={2} direction={'row'}>
                        <Avatar>{ans.user.firstName.charAt(0).toUpperCase()}</Avatar>
                        <Stack>
                            <Typography
                                textTransform={'capitalize'}>{ans.user.firstName + " " + ans.user.lastName}</Typography>
                            <Typography>{moment(ans.createdAt).fromNow()}</Typography>
                        </Stack>
                    </Stack>

                    <div style={{margin: '5px 0'}} dangerouslySetInnerHTML={{__html: ans.body}}></div>
                </Box>
            ))}

            <Box my={2}>
                <Typography variant={'h5'}>Your Answer</Typography>
                <ReactQuill value={inputAnswer} onChange={setInputAnswer}/>
                <Button onClick={postAnswer} mt={1} variant={'contained'}>Post Answer</Button>
            </Box>

        </div>
    )

}

export default QuestionViewer;