import React from 'react'
import {Box, Button, Card, CardContent, Typography} from "@mui/material";
import {Link} from "react-router-dom";

function PermissionDenied (){
    return (
        <Card>
            <CardContent>
                <Typography textAlign={'center'} variant={'h1'}>401</Typography>
                <Typography textAlign={'center'} variant={'h5'}>Has not enough permissions</Typography>
                <Box sx={{display: 'flex', justifyContent: 'center', mt: 1}}>
                    <Button component={Link} to={'/'} variant={'contained'}>Home</Button>
                </Box>

            </CardContent>
        </Card>
    )
}

export default PermissionDenied;