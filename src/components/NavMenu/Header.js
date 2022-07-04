import PropTypes from 'prop-types';
import {useTheme} from '@mui/material/styles';
import {Avatar, Box, ButtonBase} from '@mui/material';
import {appConfig} from "../../configs/app.config";

import ProfilePopup from '../ProfilePopup';

import {Menu} from "@mui/icons-material";

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
                <Box component="span" sx={{display: {xs: 'none', md: 'block'}, flexGrow: 1}}>
                    <h3>{appConfig.appName}</h3>
                </Box>
                <ButtonBase sx={{borderRadius: '12px', overflow: 'hidden'}}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.secondary.light,
                            color: theme.palette.secondary.dark,
                            '&:hover': {
                                background: theme.palette.secondary.dark,
                                color: theme.palette.secondary.light
                            }
                        }}
                        onClick={handleMenuOpen}
                        color="inherit"
                    >
                        <Menu size="1.3rem"/>
                    </Avatar>
                </ButtonBase>
            </Box>

            {/* header search */}
            <Box sx={{flexGrow: 1}}/>
            <Box sx={{flexGrow: 1}}/>

            <ProfilePopup />
        </>
    );
};

Header.propTypes = {
    status: PropTypes.func
};

export default Header;
