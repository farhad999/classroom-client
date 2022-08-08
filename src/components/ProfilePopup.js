import {useState, useRef, useEffect} from 'react';

import {useNavigate} from 'react-router-dom';

// material-ui
import {useTheme} from '@mui/material/styles';
import {
    Avatar,
    Box, Card,
    ClickAwayListener,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText, Menu,
    Paper,
    Popper, styled,
    Typography
} from '@mui/material';

import MainCard from "./MainCard";
import Transitions from "./Transitions";

// assets
import {Logout, Search, Settings, AccountBox} from '@mui/icons-material';
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../store/slices/auth";

const ProfileSection = () => {
    const theme = useTheme();

    const navigate = useNavigate();

    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [open, setOpen] = useState(false);

    let {user} = useSelector(state => state.auth);

    //logout

    let dispatch = useDispatch();

    const doLogout = () => {
        dispatch(logout());
    }

    const anchorRef = useRef(null);

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleListItemClick = (event, index, route = '') => {
        setSelectedIndex(index);
        handleClose(event);

        if (route && route !== '') {
            navigate(route);
        }
    };
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <>

            <Avatar
                sx={{
                    ...theme.typography.mediumAvatar,
                    margin: '8px 0 8px 8px !important',
                    cursor: 'pointer',
                }}
                ref={anchorRef}
                onClick={handleToggle}
            >
                {user.firstName.charAt(0)}
            </Avatar>

            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 14]
                            }
                        }
                    ]
                }}
            >
                {({TransitionProps}) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <Card border={false} elevation={16}>
                                    <Box sx={{p: 2, display: 'flex', alignItems: 'center'}}>

                                        <Avatar>
                                            {user.firstName.charAt(0)}
                                        </Avatar>

                                        <Box sx={{ml: 2}}>
                                            <Typography component="div" textTransform={'capitalize'} variant="h4"
                                                        sx={{fontWeight: 500}}>
                                                {user.firstName + " " + user.lastName}
                                            </Typography>
                                            <Typography component="div" textTransform={'capitalize'} variant="h6">
                                                {user.email}
                                            </Typography>
                                        </Box>

                                        <Divider/>
                                    </Box>

                                    <Box sx={{p: 1}}>

                                        <Divider/>

                                        <List
                                            component="nav"
                                            sx={{
                                                width: '100%',
                                                maxWidth: 350,
                                                minWidth: 300,
                                                backgroundColor: theme.palette.background.paper,
                                                borderRadius: '10px',
                                                [theme.breakpoints.down('md')]: {
                                                    minWidth: '100%'
                                                },
                                                '& .MuiListItemButton-root': {
                                                    mt: 0.5
                                                }
                                            }}
                                        >
                                            <ListItemButton
                                                selected={selectedIndex === 0}
                                                onClick={(event) => handleListItemClick(event, 0, '/user/account-profile/profile1')}
                                            >
                                                <ListItemIcon>
                                                    <Settings size="1.3rem"/>
                                                </ListItemIcon>
                                                <ListItemText primary={<Typography variant="body2">Account
                                                    Settings</Typography>}/>
                                            </ListItemButton>
                                            <ListItemButton
                                                selected={selectedIndex === 1}
                                                onClick={(event) => handleListItemClick(event, 1, '/user/social-profile/posts')}
                                            >
                                                <ListItemIcon>
                                                    <AccountBox size="1.3rem"/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={<Typography variant="body2">Profile</Typography>}/>
                                            </ListItemButton>
                                            <ListItemButton
                                                selected={selectedIndex === 4}
                                                onClick={doLogout}
                                            >
                                                <ListItemIcon>
                                                    <Logout size="1.3rem"/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={<Typography variant="body2">Logout</Typography>}/>
                                            </ListItemButton>
                                        </List>
                                    </Box>
                                </Card>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

export default ProfileSection;
