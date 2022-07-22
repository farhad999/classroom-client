import React from 'react'
import {Document, Page} from "react-pdf/dist/umd/entry.webpack";
import {Dialog} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {closeFile} from "../../store/slices/fileViewer";


function FileViewer(props) {

    //current component

    let currentComp = null;

    const {open, file} = useSelector(state => state.fileViewer);

    const dispatch = useDispatch();

    // let {file} = props;

    //file name

    let splitted = file.split('/');

    let fileName = splitted[splitted.length - 1];

    //splitted name

    let splitedName = fileName.split('.');

    let ext = splitedName[splitedName.length - 1];

    const [numPages, setNumPages] = React.useState(null);

    function onDocumentLoadSuccess({numPages}) {
        setNumPages(numPages);
    }


    if (ext === 'pdf') {

        currentComp = <Document file={file}
                                onLoadError={(error) => console.log("pdf error", error)}
                                onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
                <Page scale={1.3} pageNumber={index + 1} key={'page' + index}/>
            ))}
        </Document>;

    }else if(ext === 'jpg' || ext === 'jpeg' || ext === 'png'){
        currentComp = <img src={file} />
    }

    return <Dialog maxWidth={'md'} fullWidth={true} open={open} onClose={() => dispatch(closeFile())}>
        {currentComp}
    </Dialog>

}

export default FileViewer;