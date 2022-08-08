import PropTypes from 'prop-types';
import {useTheme} from '@mui/material/styles';
import {Avatar, Box, Button, ButtonBase, IconButton, styled, Menu, MenuItem, Divider, Typography} from '@mui/material';
import {appConfig} from "../../configs/app.config";

import ProfilePopup from '../ProfilePopup';

import {Menu as MenuIcon} from "@mui/icons-material";
import {Link} from "react-router-dom";

const Header = ({handleMenuOpen}) => {
    const theme = useTheme();

    return (
        <>
            <Box
                sx={{
                    width: 228,
                    display: 'flex',
                    alignItems: "center",
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <IconButton onClick={handleMenuOpen}>

                    <MenuIcon size="1.3rem"/>

                </IconButton>

                <Box ml={1} component="span">
                    <Typography variant={'h4'}>
                        <Link to={'/'}>{appConfig.appName}</Link>
                    </Typography>
                </Box>

            </Box>

            <Box sx={{flexGrow: 1}}/>

            <ProfilePopup />
        </>
    );
};

Header.propTypes = {
    status: PropTypes.func
};

export default Header;
