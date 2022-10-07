import React from 'react'

const RenderIf = ({condition, children}) => {
    if (condition) {
        return children;
    }
}

export default RenderIf;
