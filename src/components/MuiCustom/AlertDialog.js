import React from 'react'
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText} from "@mui/material";

function AlertDialog({open, onClose, action, title, description}) {

    return (
        <Dialog open={open}
                onClose={onClose}
                maxWidth={'xs'}
                fullWidth={true}
        >
            <DialogTitle sx={{fontSize: '20px'}}>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{description}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={action}>Delete</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AlertDialog;