import React from "react";

const RenderIfElse = ({condition, children}) => {
    if (condition) {
        return children[0];
    } else {
        return children[1];
    }
}

export default RenderIfElse;
