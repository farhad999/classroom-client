import React from "react";
import axios from "axios";
import {Button, Card, CardContent, Typography} from "@mui/material";
import {Link} from 'react-router-dom'
import RenderIf from "../components/wrappers/RenderIf";

function Dashboard() {

    const [loading, setLoading] = React.useState(true);

    const [routine, setRoutine] = React.useState();

    React.useEffect(() => {
        axios.get('/home')
            .then(res => {
                setLoading(false);

                let {routine} = res.data;
                setRoutine(routine);

            }).catch(er => console.log(er))
    }, []);

    if (loading) {
        return <div>loading...</div>
    }

    return (
        <div>

            <div>Dashboard</div>

            {
                routine &&

                <Card>
                    <CardContent>
                        <Typography>{routine.name}</Typography>
                        <Typography>Priority base routine</Typography>
                        <Button component={Link} to={`/routines/${routine.id}`} variant={'contained'}>Add your
                            Class</Button>
                    </CardContent>
                </Card>
            }
        </div>
    )
}

export default Dashboard;
