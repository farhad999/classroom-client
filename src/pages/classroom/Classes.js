import React from 'react'
import axios from "axios";
import {Box, Card, CardContent, CardHeader, Grid, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {useNavigate} from 'react-router-dom'
import ErrorWrapper from "../../components/ErrorWrapper";

export default function Classes() {

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
            <Typography variant={'h4'}>Active Classes</Typography>
            {classes.activeClasses.map((cls) => (
                <Card>
                    <CardHeader>
                        <Typography variant={'h4'}>{cls.courseName}</Typography>
                    </CardHeader>
                </Card>
            ))}

            <Box sx={{py: 2}}>

                <Typography sx={{py: 1}} variant={'h4'}>Classes</Typography>

                <Grid container>
                    {classes.cls.map((cls) => (

                        <Grid key={cls.id} item xs={12} sm={6} md={4}>
                            <Link to={'/c/' + cls.id}>
                                <Card>
                                    <CardHeader sx={{bgcolor: 'primary.main'}} title={<Typography color={'whitesmoke'} variant={'h4'}>{cls.courseName}</Typography>}/>
                                    <CardContent>
                                        <Typography variant={'h5'}>Course code: {cls.courseCode}</Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>

                    ))}
                </Grid>
            </Box>
        </ErrorWrapper>
    )
}