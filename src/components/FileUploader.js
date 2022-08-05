import React from 'react'
import {
    Box, Grid, Icon, IconButton, Stack, Typography, Dialog, DialogContent,
    DialogTitle, Button, Table, TableBody, TableRow, TableCell,
    LinearProgress
} from "@mui/material";
import {Close, FileUploadOutlined, CloudUploadOutlined} from "@mui/icons-material";
import axios from "axios";
import PropTypes from "prop-types";
import {CustomDialogTitle} from "./MuiCustom/CustomDialogTitle";

const FileUploader = React.forwardRef((props, ref) => {

    const {uploadDirectory, onUploadComplete, itemFullWidth, onFileRemoved, initialFiles} = props;

    const fileRef = React.useRef();

    const [uploadDialog, setUploadDialog] = React.useState(false);

    const [currentFiles, setCurrentFiles] = React.useState([]);

    const [files, setFiles] = React.useState(initialFiles);

    const [hideSection, setHideSection] = React.useState(false);

    function fileInputChange(event) {

        //files is not iterable by map or forEach

        let files = event.target.files;

        if (files.length) {
            setHideSection(true);
        }

        let f = [];

        [...files].forEach((file, index) => {

            let {name, size} = file;

            f.push({name, size, id: index, uploading: 'uploading', progress: 0});
        });

        [...files].forEach((file, index) => {

                let formData = new FormData();

                formData.append('file', file);

                axios.post(`/f/upload_one?directory=${uploadDirectory}`, formData, {
                    headers: {
                        'content-type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {

                        let elIndex = f.findIndex(ff => ff.id === index);

                        let el = f[elIndex];

                        f[elIndex] = {...el, progress: Math.round((progressEvent.loaded / progressEvent.total) * 100)};

                        setCurrentFiles([...f]);
                    }
                },)
                    .then(res => {
                        let {status, file} = res.data;

                        if (status === 'success') {
                            setFiles((prev) => [...prev, file]);
                            onUploadComplete(file);
                        }

                        if (status === 'success' && f.length === index + 1) {
                            setUploadDialog(false);
                            setUploadDialog(false);
                            setCurrentFiles([]);

                        }
                    }).catch(er => console.log(er))

            }
        );


        // console.log('files', files, typeof []);

    }

    function removeItem(index) {
        let file = files[index];

        axios.delete('/f/' + encodeURIComponent(file.path))
            .then(res => {
                let {status} = res.data;
                if (status === 'success') {
                    setFiles(files.filter((i, ind) => index !== ind));
                    onFileRemoved(files);
                }
            }).catch(er => console.log(er))

    }

    React.useImperativeHandle(ref, () => ({

        openDialog() {
            setUploadDialog(true);
            setHideSection(false);
        }

    }));

    return (
        <div>

            <Grid container spacing={2}>

                {files.map((attachment, index) => (

                    <Grid item key={index} xs={12} md={itemFullWidth ? 12 : 6}>

                        <Stack borderRadius={1} p={1} border={1} borderColor={'#ddd'}
                               direction={'row'}
                               justifyContent={'space-between'} alignItems={'center'}>
                            <Typography>{attachment.name}</Typography>

                            <IconButton onClick={() => removeItem(index)}><Close/></IconButton>
                        </Stack>

                    </Grid>
                ))}


            </Grid>

            <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)}
                    maxWidth={'sm'} fullWidth={true}
                    PaperProps={{
                        style: {
                            minHeight: '80%',
                        }
                    }}
            >
                <CustomDialogTitle onClose={() => setUploadDialog(false)}>
                    <Typography variant={'h4'}>Upload File</Typography>
                </CustomDialogTitle>

                <DialogContent>

                    <input onChange={fileInputChange} ref={fileRef} style={{display: 'none'}} type={'file'}
                           multiple/>


                    {!hideSection &&
                        <Stack direction={'column'} alignItems={'center'} justifyContent={'center'}>
                            <CloudUploadOutlined sx={{fontSize: '100px'}}/>


                            <Button variant={'contained'} onClick={() => fileRef.current.click()}>Browse</Button>
                        </Stack>
                    }


                    <Table>
                        <TableBody>
                            {currentFiles.map((file, index) => (
                                <TableRow key={index}>
                                    <TableCell>{file.name}</TableCell>
                                    <TableCell width={'30%'} align={'center'}>
                                        <Box sx={{width: '100%'}}>
                                            <LinearProgress variant="determinate" value={file.progress}/>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{file.size}</TableCell>
                                    <TableCell>{file.id}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>


                </DialogContent>
            </Dialog>

        </div>
    )
});

FileUploader.propTypes = {
    onUploadComplete: PropTypes.func,
    uploadDirectory: PropTypes.string,
    itemFullWidth: PropTypes.bool,
    onFileRemoved: PropTypes.func,
    initialFiles: PropTypes.array,
}

FileUploader.defaultProps = {
    itemFullWidth: false,
    initialFiles: [],
}

export default FileUploader;