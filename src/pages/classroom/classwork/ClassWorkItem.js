import React from 'react'
import {useParams, Link, Outlet} from "react-router-dom";
import {
    Box,
    Stack, Tab, Tabs,
} from "@mui/material";

function ClassWorkItem() {
    //tabs

    const [activeTab, setActiveTab] = React.useState(null);

    let {id, w} = useParams();

    React.useEffect(() => {

        let location = window.location.pathname;

        let tab = location.split('/').pop();

        if(tab === 'submissions'){
            setActiveTab(1);
        }else{
            setActiveTab(0);
        }

    });

    const handleTabChange = (event, value) => {
        setActiveTab(value);
    }

    return (
        <>
            <div>

                <Box sx={{bgcolor: 'background.paper', mb: 2}}>

                    <Tabs
                        onChange={handleTabChange}
                        centered={true}
                        value={activeTab}

                    >
                        <Tab label='Details' to={`/c/${id}/w/${w}`} component={Link}/>
                        <Tab label='Submissions' to={`/c/${id}/w/${w}/submissions`}
                             component={Link}/>
                    </Tabs>
                </Box>

                <Outlet/>

            </div>

        </>
    )
}

export default ClassWorkItem;