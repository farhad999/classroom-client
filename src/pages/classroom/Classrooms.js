import React from 'react'
import axios from "axios";
import {Box, Card, CardContent, CardHeader, Grid, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {useNavigate} from 'react-router-dom'
import ErrorWrapper from "../../components/ErrorWrapper";
import RenderIfElse from "../../components/wrappers/RenderIfElse";
import RenderIf from "../../components/wrappers/RenderIf";

export default function Classrooms() {

    const [classes, setClasses] = React.useState({});

    const [loading, setLoading] = React.useState(true);

    const [statusCode, setStatusCode] = React.useState(null);

    //navigator

    const navigator = useNavigate();

    React.useEffect(() => {
        axios.get('/c')
            .then(res => {

                setLoading(false);
                setClasses(res.data);

            }).catch(er => {
            let {status} = er.response;
            console.log('status code', status, er);
            setStatusCode(status);
            console.log('status', status);
        });
    }, []);

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <ErrorWrapper status={statusCode}>

            <Box sx={{py: 2}}>

                <Typography sx={{my: 2}} variant={'h4'}>Active Classes</Typography>
                <RenderIfElse condition={classes.activeClasses.length}>
                    <Grid container spacing={2}>
                        {classes.activeClasses.map((cls) => (

                            <Grid key={cls.id} item xs={12} sm={6} md={4}>
                                <Link to={'/c/' + cls.id}>
                                    <Card height={'100%'}>
                                        <CardHeader sx={{bgcolor: 'primary.main', height: '100px'}}
                                                    title={<Typography color={'whitesmoke'}
                                                                       variant={'h4'}>{cls.courseName}</Typography>}/>
                                        <CardContent>
                                            <Typography variant={'h5'}>Course code: {cls.courseCode}</Typography>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Grid>

                        ))}
                    </Grid>
                    <Card>
                        <CardContent>No Active Classes</CardContent>
                    </Card>
                </RenderIfElse>

            </Box>

            <RenderIf condition={classes.cls.length}>
                <Box sx={{py: 2}}>

                    <Typography sx={{py: 1}} variant={'h4'}>Classes</Typography>

                    <Grid container>
                        {classes.cls.map((cls) => (

                            <Grid key={cls.id} item xs={12} sm={6} md={4}>
                                <Link to={'/c/' + cls.id}>
                                    <Card>
                                        <CardHeader sx={{bgcolor: 'primary.main'}} title={<Typography color={'whitesmoke'}
                                                                                                      variant={'h4'}>{cls.courseName}</Typography>}/>
                                        <CardContent>
                                            <Typography variant={'h5'}>Course code: {cls.courseCode}</Typography>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Grid>

                        ))}
                    </Grid>


                </Box>
            </RenderIf>

        </ErrorWrapper>
    )
}
