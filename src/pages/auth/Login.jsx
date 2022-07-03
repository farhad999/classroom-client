import {useForm, Controller} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import React, {useState} from "react";
import {Navigate, Link, useNavigate} from "react-router-dom";
import {fetchUser, login} from "../../store/slices/auth";
import {
    Box,
    Button,
    Checkbox, FormControl, FormControlLabel,
    FormHelperText, Grid, IconButton,
    InputAdornment, InputLabel, OutlinedInput, Stack, Snackbar,
    Typography, useMediaQuery
} from '@mui/material'

import {useTheme} from "@mui/material/styles";
import AuthCardWrapper from "../../components/AuthCardWrapper";
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import {toast} from "react-toastify";

function Login() {


    //redux

    let dispatch = useDispatch();

    let {loginMessage, user} = useSelector(state => state.auth);

    //schema

    const loginSchema = yup.object().shape({
        email: yup.string().email("Email is not valid").required("Email is Required"),
        password: yup.string().required().min(8, "Password must be 8 characters length"),
    });

    //validation

    let {register, handleSubmit, formState: {errors}} = useForm({resolver: yupResolver(loginSchema)});

    //methods

    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const doLogin = async (data) => {

        dispatch(login(data))
            .then(res => {
                let {status, token} = res.payload;

                if (status === 'success') {
                    axios.defaults.headers['authorization'] = 'Bearer ' + token;
                    dispatch(fetchUser());
                } else {
                    toast.error("Email or Password is incorrect");
                }
            });

    }

    if (user) {
        return <Navigate to={'/'}/>
    }


    return (

        <>

            <Grid container direction="column" justifyContent="flex-center" sx={{minHeight: '100vh'}}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{minHeight: 'calc(100vh - 68px)'}}>
                        <Grid item sx={{m: {xs: 1, sm: 3}, mb: 0}}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item sx={{mb: 3}}>
                                        <Link to="#">
                                            <h3>VClassroom</h3>
                                        </Link>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            direction={matchDownSM ? 'column-reverse' : 'row'}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Grid item>
                                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                    <Typography
                                                        color={theme.palette.secondary.main}
                                                        gutterBottom
                                                        variant={matchDownSM ? 'h3' : 'h2'}
                                                    >
                                                        Hi, Welcome Back
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        fontSize="16px"
                                                        textAlign={matchDownSM ? 'center' : 'inherit'}
                                                    >
                                                        Enter your credentials to continue
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>

                                        <form onSubmit={handleSubmit(doLogin)}>
                                            <FormControl fullWidth margin={'normal'}>
                                                <InputLabel >Email</InputLabel>
                                                <OutlinedInput
                                                    {...register('email')}
                                                    type="text"
                                                    name="email"
                                                    label="Email"

                                                />
                                            </FormControl>

                                            <FormHelperText error={!!errors?.email}>
                                                {errors.email?.message}
                                            </FormHelperText>

                                            <FormControl
                                                fullWidth
                                                margin={'normal'}

                                            >
                                                <InputLabel
                                                >Password</InputLabel>
                                                <OutlinedInput
                                                    {...register('password')}
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={handleMouseDownPassword}
                                                                edge="end"
                                                                size="large"
                                                            >
                                                                {showPassword ? <Visibility/> : <VisibilityOff/>}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    label="Password"
                                                />

                                            </FormControl>

                                            <FormHelperText error={!!errors?.password}>
                                                {errors.password?.message}
                                            </FormHelperText>


                                            <Box sx={{mt: 2}}>

                                                <Button
                                                    disableElevation
                                                    fullWidth
                                                    size="large"
                                                    type="submit"
                                                    variant="contained"
                                                    color="secondary"
                                                >
                                                    Sign in
                                                </Button>

                                            </Box>
                                        </form>

                                    </Grid>

                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>


        </>

    )

}

export default Login;