import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

// material-ui
import {useTheme} from '@mui/material/styles';
import {
    Collapse,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useMediaQuery
} from '@mui/material';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";

import {openMenu, closeMenu} from "../../store/slices/theme";
import Menu from "./Menu";


const NavItem = ({item, level}) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const matchesSM = useMediaQuery(theme.breakpoints.down('lg'));

    let {selectedMenu} = useSelector(state => state.theme);

    const itemIcon = item?.icon ? item.icon : (
        <FiberManualRecordIcon fontSize={"inherit"}/>
    );

    const itemHandler = (id) => {
        if (open()) {
            dispatch(openMenu({id: ""}));
        } else {
            dispatch(openMenu({id}));
        }
    }

    const hasChildren = () => {
        return item.hasOwnProperty('children') && item.children.length;
    }

    const isActive = () => {
        let currentURL = document.location.pathname
            .toString();
        return currentURL === item.url;

    }

    const open = () => {

        let menus = selectedMenu.split('-');

        return menus.includes(item.id);
    }

    return (

        <>
            <ListItemButton
                component={item.url && Link}
                to={item.url}
                sx={{
                    mb: 0.5,
                    alignItems: 'flex-start',
                    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
                    py: level > 1 ? 1 : 1.25,
                    pl: `${10 + level * 24}px`
                }}
                selected={isActive()}
                onClick={() => itemHandler(item.id)}
            >
                <ListItemIcon sx={{my: 'auto', minWidth: !item?.icon ? 18 : 36}}>{itemIcon}</ListItemIcon>
                <ListItemText
                    primary={
                        <Typography variant={isActive() ? 'h5' : 'body1'}
                                    color="inherit">
                            {item.title}
                        </Typography>
                    }
                />
                {hasChildren() ? open() ?
                    <KeyboardArrowUp/> : <KeyboardArrowDown/> : null
                }

            </ListItemButton>

            {
                hasChildren() &&

                <Collapse in={open()} timeout="auto" unmountOnExit>
                    <List
                        component="div"
                        disablePadding
                    >
                        <Menu items={item.children} level={level + 1}/>
                    </List>
                </Collapse>

            }

        </>

    );
};

NavItem.propTypes = {
    item: PropTypes.object,
    level: PropTypes.number
};

export default NavItem;
