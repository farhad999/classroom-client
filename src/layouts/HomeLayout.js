import React from 'react'
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Navigate, Outlet} from 'react-router-dom';
import {styled, useTheme} from '@mui/material/styles';
import {AppBar, Box, CssBaseline, Stack, Toolbar, useMediaQuery} from '@mui/material';
import Header from "../components/NavMenu/Header";
import Sidebar from "../components/NavMenu/Sidebar";
import {themeConfig} from "../configs/theme";

// styles
const Main = styled('main')(({theme}) => ({

    ...{
        margin: '15px 15px 0px',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        width: `calc(100% - ${themeConfig.drawerWidth}px)`,
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px',
            width: '100%',
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '10px'
        }
    }
}));

const HomeLayout = () => {
    const theme = useTheme();

    const [open, setOpen] = React.useState(false);

    let {user} = useSelector(state => state.auth);

    if (!user) {
        return <Navigate to={'/auth/login'}/>
    }

    return (
        <Box>
            <CssBaseline/>

            <AppBar
                enableColorOnDark
                position="sticky"
                elevation={1}
                color={'inherit'}
            >
                <Toolbar>
                    <Header handleMenuOpen={() => setOpen(!open)}/>
                </Toolbar>
            </AppBar>

            <Stack direction={'row'}>
                <Sidebar drawerOpen={open} drawerToggle={() => setOpen(!open)}/>

                {/* main content */}
                <Main>
                    <Outlet/>
                </Main>
            </Stack>

        </Box>
    );
};

export default HomeLayout;