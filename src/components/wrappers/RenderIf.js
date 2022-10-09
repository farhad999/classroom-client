import React from 'react'

const RenderIf = ({condition, children}) => {
    if (condition) {

        console.log('condition', condition);

        return children;
    }
}

export default RenderIf;
