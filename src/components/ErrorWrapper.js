import React from 'react'
import NotFound from "./Errors/NotFound";
import PermissionDenied from "./Errors/PermissionDenied";

function ErrorWrapper({status, children}) {



    if (status === 404) {
        return <NotFound/>
    } else if (status === 401) {
        return <PermissionDenied/>
    }else{
        return <>{children}</>;
    }
}

export default ErrorWrapper;