import React from 'react'
import {
    AppBar,
    Button,
    Card,
    CardContent, Dialog,
    DialogContent,
    Grid,
    Icon,
    IconButton, TextField,
    Toolbar,
    Typography
} from "@mui/material";
import {AssignmentOutlined, Close} from "@mui/icons-material";
import {Controller, useForm} from "react-hook-form";
import FileUploader from "./FileUploader";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {DateTimePicker} from "@mui/x-date-pickers";
import {useParams} from "react-router-dom";
import axios from "axios";
import moment from "moment";
import PropTypes from "prop-types";

function CreateOrUpdateAssignment(props) {

    const {openDialog, closeDialog,classId,initial, attachments, onSuccess} = props;

    const [uploads, setUploads] = React.useState(attachments);

    //let ref

    const uploadRef = React.useRef();

    const {control, handleSubmit} = useForm({
        defaultValues: initial
    });

    const createAssignment = (data) => {

        data.due = data.due && moment(data.due).format('YYYY-MM-DD HH:mm:ss');

        data.attachments = uploads.map(item=>({id: item.id, name:item.name,
            path: item.path, size: item.size}));

        let {title, due, attachments, points, id} = data;

        axios.post(`/c/${classId}/assignments`,{title, due, attachments, points, id})
            .then(res => {
                let {status} = res.data;
                if(status === 'success'){
                    onSuccess();
                }
            }).catch(er => console.log(er))
    }

    return (
        <Dialog open={openDialog} onClose={closeDialog}
                fullScreen={true}

        >
            <form onSubmit={handleSubmit(createAssignment)}>

                <AppBar color={'transparent'} sx={{position: 'relative'}}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={closeDialog}
                            aria-label="close"
                        >
                            <Close/>
                        </IconButton>

                        <Icon color={'primary'}>
                            <AssignmentOutlined/>
                        </Icon>

                        <Typography sx={{ml: 2, flex: 1}} variant="h4" component="div">
                            Assignment
                        </Typography>
                        <Button type={'submit'} autoFocus variant={'contained'}>
                            Save
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent sx={{backgroundColor: '#efefef'}}>
                    <Grid container spacing={2}>

                        <Grid item sm={8}>
                            <Card>
                                <CardContent>

                                    <Controller render={({field: {value, onChange}}) => (
                                        <TextField label={'Title'}
                                                   variant={'filled'}
                                                   value={value}
                                                   onChange={(event) => onChange(event.target.value)}
                                                   margin={'normal'} fullWidth={true}
                                        />
                                    )} name={'title'} control={control}/>


                                    <Controller render={({field: {value, onChange}}) => (
                                        <TextField label={'Description'} fullWidth={true}
                                                   margin={"normal"}
                                                   variant={'filled'}
                                                   multiline={true} rows={4} value={value}
                                                   onChange={(event) => onChange(event.target.value)}
                                        />
                                    )} name={'description'} control={control}/>


                                    <FileUploader
                                        ref={uploadRef}
                                        uploadDirectory={`classes/${classId}`}
                                        initialFiles={uploads}
                                        onUploadComplete={(file) => setUploads(prev => [...prev, file])}
                                        onFileRemoved={(files) => setUploads(files)}
                                    />

                                    <Button onClick={() => uploadRef.current.openDialog()}>Upload</Button>

                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item sm={4}>
                            <Card>
                                <CardContent>

                                    <Typography>Points</Typography>

                                    <Controller render={({field: {value, onChange}}) => (
                                        <TextField label={'Points'} fullWidth={true} variant={'filled'}
                                                   margin={'normal'}
                                                   value={value} onChange={(event) => onChange(event.target.value)}
                                        />
                                    )} name={'points'} control={control}/>


                                    <LocalizationProvider dateAdapter={AdapterMoment}>

                                        <Controller render={({field: {value, onChange}}) => (
                                            <DateTimePicker
                                                label={'Due Date'}
                                                renderInput={(props) =>
                                                    <TextField {...props} fullWidth={true}
                                                               margin={'normal'} variant={'filled'}
                                                    />}
                                                onChange={(d) => {
                                                    onChange(d)
                                                }}
                                                value={value}
                                            />
                                        )} name={'due'} control={control}/>


                                    </LocalizationProvider>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </DialogContent>
            </form>
        </Dialog>
    )

}

CreateOrUpdateAssignment.propTypes = {
    attachments: PropTypes.array,
    classId: PropTypes.string.isRequired,
    onSuccess: PropTypes.func,
}

CreateOrUpdateAssignment.defaultProps = {
    attachments: [],
    initial: {
        due: null,
        points: '',
    }
}

export default CreateOrUpdateAssignment;