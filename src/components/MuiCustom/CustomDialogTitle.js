import {Box, DialogTitle, IconButton, Stack} from "@mui/material";
import {Close} from '@mui/icons-material'
import PropTypes from "prop-types";

export const CustomDialogTitle = (props) => {
    const {children, onClose, ...other} = props;

    return (
        <DialogTitle sx={{px: 3}} {...other}>
            <Stack direction={'row'}
                   justifyContent={'space-between'}
                   alignItems={'center'}
            >
                {children}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                        bgcolor: (theme) => theme.palette.grey[100],
                    }}
                >
                    <Close/>
                </IconButton>

            </Stack>

        </DialogTitle>
    );
};

CustomDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};