import React from 'react'
import {Box, Card, Grid, Icon, IconButton, List, ListItem, Stack, Typography} from "@mui/material";
import {Close, FileUploadOutlined} from "@mui/icons-material";
import axios from "axios";

function FileManager() {

    const fileRef = React.useRef();

    const [files, setFiles] = React.useState([]);

    function fileInputChange(event) {

        //files is not iterable by map or forEach

        let files = event.target.files;

        let f = [];

        let formData = new FormData();


        for (let file of files) {
            f.push(file);
            formData.append('files', file);
        }

        axios.post('/f/upload', formData, {
            headers: {
                'content-type': 'multipart/form-data',
            }
        })
            .then(res => {
                console.log('file res', res);
            }).catch(er => console.log(er))

        setFiles((prev) => [...prev, ...f]);

        // console.log('files', files, typeof []);

    }

    function removeItem(index) {
        let file = files[index];
        axios.delete('/f/' + file.name)
            .then(res => {
                let {status} = res.data;
                if (status === 'success') {
                    setFiles(files.filter((i, ind) => index !== ind));
                }
            }).catch(er => console.log(er))

    }

    return (
        <div>

            <Grid container>

                {files.map((attachment, index) => (

                    <Grid item key={index} md={6} spacing={2}>

                        <Stack borderRadius={1} p={1} border={1} borderColor={'#ddd'} direction={'row'}
                               justifyContent={'space-between'} alignItems={'center'}>
                            <Typography>{attachment.name}</Typography>
                            <IconButton
                                onClick={() => removeItem(index)}><Close/></IconButton>
                        </Stack>

                    </Grid>
                ))}


            </Grid>

            <Stack my={1} direction={'row'}>

                <IconButton onClick={() => fileRef.current.click()}>
                    <Icon color={'primary'}>
                        <FileUploadOutlined/>
                    </Icon>
                </IconButton>

                <input onChange={fileInputChange} ref={fileRef} style={{display: 'none'}} type={'file'}
                       multiple
                       accept=
                           "application/msword, application/vnd.ms-powerpoint,
text/plain, application/pdf, image/*"
                />

            </Stack>
        </div>
    )
}

export default FileManager;