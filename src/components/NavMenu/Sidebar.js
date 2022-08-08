import PropTypes from 'prop-types';
import {useTheme} from '@mui/material/styles';
import {Box, Drawer, useMediaQuery} from '@mui/material';
import Menu from './Menu';
import {themeConfig} from "../../configs/theme";
import {appConfig} from '../../configs/app.config'
import {menuItems} from '../../configs/menuItems';

const Sidebar = ({drawerOpen, drawerToggle, window}) => {

    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

    const drawer = (
        <>
            <Box sx={{display: {xs: 'block', md: 'none'}}}>
                <Box sx={{display: 'flex', p: 2, mx: 'auto'}}>
                    {appConfig.appName}
                </Box>
            </Box>

            <Box sx={{px: 2}}>
                <Menu items={menuItems}/>
            </Box>

        </>
    );

    const container = window !== undefined ? () => window.document.body : undefined;

    return (
        <Box component="nav" sx={{flexShrink: {md: 0}, width: matchUpMd ? themeConfig.drawerWidth : 'auto'}}
             aria-label="mailbox folders">
            <Drawer
                variant={matchUpMd ? 'permanent' : 'temporary'}
                anchor="left"
                open={drawerOpen}
                onClose={drawerToggle}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: themeConfig.drawerWidth,
                        background: theme.palette.white,
                        color: theme.palette.text.primary,
                        borderRight: 'none',
                        [theme.breakpoints.up('md')]: {
                            top: '85px'
                        }
                    }
                }}
                ModalProps={{keepMounted: true}}
                color="inherit"
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

Sidebar.propTypes = {
    drawerOpen: PropTypes.bool,
    drawerToggle: PropTypes.func,
    window: PropTypes.object
};

export default Sidebar;
