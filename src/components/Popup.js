import React from "react"
import "../css/Popup.css"

function Popup(props) {

    const assignPopup = props.assignPopup;

    React.useEffect(() => {
        setTimeout(() =>{
            assignPopup(null)
        }, 3000)
    }, [assignPopup]);

    return (
        <div className="Popup">
            <p>{props.message}</p>
            <div className="underline"></div>
        </div>
    );
}

export default Popup;