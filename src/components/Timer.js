import React, { useEffect, useState } from "react";
import '../css/Timer.css';

function Timer(props) {
    const [time, setTime] = useState("-:--");

    const calcTime = ()=>{
        const now = Math.floor(Date.now() / 1000)
        var seconds = now - props.startTime
        const minutes = Math.floor(seconds / 60)
        var seconds = seconds % 60;
        setTimeout(()=>{setTime(calcTime())}, 1000)
        if(seconds < 10) return (`${minutes}:0${seconds}`)
        return (`${minutes}:${seconds}`)
    }
    
    setTimeout(()=>{setTime(calcTime())}, 1000)

    return(
        <p className="Timer">Time Elapsed: {time}</p>
    );
}

export default React.memo(Timer);