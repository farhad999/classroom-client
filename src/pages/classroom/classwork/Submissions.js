import React from 'react'
import axios from "axios";
import {useParams} from "react-router-dom";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";

function Submissions(props){

    const {id, w} = useParams();
    const [loading, setLoading] = React.useState(true);
    const [submissions, setSubmissions] = React.useState([]);

    React.useEffect(()=>{
        axios.get(`/c/${id}/assignments/${w}/get_submissions`)
            .then(res=>{
                setLoading(false);
                setSubmissions(res.data);
            }).catch(er=>console.log(er))
    }, []);

    if(loading){
        return  <div>
            loading...
        </div>
    }

    return(
        <div>
            Submissions
            <Table>
                <TableHead>
                    <TableCell>Name</TableCell>
                    <TableCell>StudentId</TableCell>
                    <TableCell>Status</TableCell>
                </TableHead>
                <TableBody>
                    {submissions.map((submission,index)=> (
                        <TableRow>
                            <TableCell>{submission.firstName+ ' '+submission.lastName}</TableCell>
                            <TableCell>{submission.studentId}</TableCell>
                            <TableCell>{submission.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default Submissions;