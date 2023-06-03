import React from "react";
import "../css/NameSelect.css"

function NameSelect(props) {

    const assignPopup = props.assignPopup
    const assignName = props.assignName

    const handleKeyDown = (event) => {
        if(event.key === "Enter"){
            let cur_name = event.target.value
            if(cur_name.length === 0){
                assignPopup("Name Can't Be Empty")
            }
            else{
                assignName(cur_name)
                assignPopup(`Hi There ${cur_name}!`)
            }
        }
    }

  return (
    <div className="NameSelect">
        <div className="inline">
            <p>ENTER NAME:</p>
            <input onKeyDown={handleKeyDown} type="text" name="name" className="NameInput" maxLength="16"/>
        </div>
    </div>
  );
}

export default NameSelect;