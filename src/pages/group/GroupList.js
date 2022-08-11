import React from 'react'
import {
    Box,
    Button, Card, CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import axios from "axios";
import {Link, useNavigate} from 'react-router-dom'

function GroupList() {

    const [openDialog, setOpenDialog] = React.useState(false);

    const [groupName, setGroupName] = React.useState('');

    const [loading, setLoading] = React.useState(true);

    const [groups, setGroups] = React.useState([]);

    const navigator = useNavigate();

    function createGroup() {
        axios.post('/g', {name: groupName})
            .then(res => {

                let {status, groupId} = res.data;

                if(status === 'success'){
                    navigator(`/g/${groupId}`);
                }

            }).catch(er => console.log(er))
    }

    React.useEffect(() => {
        axios.get('/g')
            .then(res => {
                setLoading(false);
                setGroups(res.data);
            }).catch(er => console.log(er))
    }, [])

    return (
        <div>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant={'h3'}>Groups</Typography>
                <Button variant={'contained'} onClick={() => setOpenDialog(true)}>Add</Button>
            </Stack>

            {groups.map((group, index) => (

                <Link to={`/g/${group.id}`}>
                    <Box component={Paper} px={1} py={2} my={1} >
                        <Typography textTransform={'capitalize'} variant={'h5'}>{group.name}</Typography>
                    </Box>
                </Link>

            ))}

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}
                    maxWidth={'sm'} fullWidth={true}
            >
                <DialogTitle>
                    <Typography variant={'h4'}>Create New Group</Typography>
                </DialogTitle>
                <DialogContent>
                    <form>

                        <TextField
                            variant={'filled'}
                            label={'Group Name*'}
                            fullWidth={true}
                            value={groupName}
                            onChange={event => setGroupName(event.target.value)}
                        />


                    </form>
                </DialogContent>

                <DialogActions>
                    <Box>
                        <Button disabled={!groupName.length} onClick={createGroup} variant={'contained'}>Create</Button>
                    </Box>
                </DialogActions>

            </Dialog>

        </div>
    )
}

export default GroupList;