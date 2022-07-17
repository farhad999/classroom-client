import React from 'react'
import {Box, Button, Card, CardActions, CardContent, Typography} from "@mui/material";
import {Link} from "react-router-dom";

function NotFound (){
    return (
        <Card>
            <CardContent>
                <Typography textAlign={'center'} variant={'h1'}>404</Typography>
                <Typography textAlign={'center'}>Page Not Found</Typography>
            </CardContent>
            <CardActions>
                <Box sx={{display: 'flex', justifyContent: 'center', mt: 1}}>
                    <Button component={Link} to={'/'} variant={'contained'}>Home</Button>
                </Box>
            </CardActions>
        </Card>
    )
}

export default NotFound;