import React from "react";
import '../css/CurrentName.css';

function CurrentName(props) {

    const name = props.name;

    return (
        <div className="CurrentName">
            {
                name == null ? null : <p>Current Name: {name}</p>
            }
        </div>
    );
}

export default CurrentName;