import React from 'react'
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Navigate, Outlet} from 'react-router-dom';
import {styled, useTheme} from '@mui/material/styles';
import {AppBar, Box, CssBaseline, Toolbar, useMediaQuery} from '@mui/material';
import Header from "../components/NavMenu/Header";
import Sidebar from "../components/NavMenu/Sidebar";
import {themeConfig} from "../configs/theme";

// styles
const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})(({theme, open}) => ({
    ...theme.typography.mainContent,
    ...(!open && {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        [theme.breakpoints.up('md')]: {
            marginLeft: -(themeConfig.drawerWidth - 20),
            width: `calc(100% - ${themeConfig.drawerWidth}px)`
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px',
            width: `calc(100% - ${themeConfig.drawerWidth}px)`,
            padding: '16px'
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '10px',
            width: `calc(100% - ${themeConfig.drawerWidth}px)`,
            padding: '16px',
            marginRight: '10px'
        }
    }),
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        width: `calc(100% - ${themeConfig.drawerWidth}px)`,
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px'
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '10px'
        }
    })
}));

const HomeLayout = () => {
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'));

    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        setOpen(!matchDownMd);
    }, [matchDownMd]);

    let {user} = useSelector(state => state.auth);

    if (!user) {
        return <Navigate to={'/auth/login'}/>
    }

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>

            <AppBar
                enableColorOnDark
                position="fixed"
                color="inherit"
                elevation={0}
                sx={{
                    bgcolor: theme.palette.background.default,
                    transition: open ? theme.transitions.create('width') : 'none'
                }}
            >
                <Toolbar>
                    <Header handleMenuOpen={() => setOpen(!open)}/>
                </Toolbar>
            </AppBar>

            {/* drawer */}
            <Sidebar drawerOpen={open} drawerToggle={() => setOpen(!open)}/>

            {/* main content */}
            <Main theme={theme} open={open}>
                <Outlet/>
            </Main>

        </Box>
    );
};

export default HomeLayout;
