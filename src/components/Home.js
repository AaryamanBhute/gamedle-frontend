import React, { useEffect, useState } from "react";
import NameSelect from "./NameSelect";
import CurrentName from "./CurrentName";
import MakeGame from "./MakeGame.js";
import JoinGame from "./JoinGame.js";
import JoinMenu from "./JoinMenu.js";
import SelectMenu from "./SelectMenu.js";
import '../css/Home.css';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';

function Home(props) {

    const navigate = useNavigate()

    const [selectMenu, setSelectMenu] = useState(false)
    const [joinMenu, setJoinMenu] = useState(false)

    const assignName = props.assignName
    const assignPopup = props.assignPopup
    const assignToken = props.assignToken
    const name = props.name

    useEffect(()=>{
        document.title = "Gamedle - Home"
    })

    useEffect(()=>{
        socket.disconnect()
    }, [])

    return (
        <div className="Home">
            <NameSelect assignName={assignName} assignPopup={assignPopup} name={name}/>
            <CurrentName name={name}/>
            {selectMenu ? <SelectMenu closeMenu={()=>{setSelectMenu(false);}} assignToken={assignToken} name={name} assignPopup={assignPopup}
            choices={["Anagrams"]} /> : null}
            {joinMenu ? <JoinMenu closeMenu={()=>{setJoinMenu(false);}} assignToken={assignToken} name={name} assignPopup={assignPopup}/> : null}
            <div className="Title">
                <h1>Gamedle</h1>
                <h2>Why play alone?</h2>
            </div>
            <div className="Games">
                <MakeGame assignToken={assignToken} openMenu={()=>{if(name === null || name.length === 0){assignPopup("Choose A Name!"); return;} setSelectMenu(true);}}/>
                <JoinGame assignToken={assignToken} openMenu={()=>{if(name === null || name.length === 0){assignPopup("Choose A Name!"); return;} setJoinMenu(true);}}/>
            </div>
            {props.token === null? null : <p>Looks like you were in a game... <a className="Rejoin" onClick={()=>{
                navigate('/anagrams')
            }}>Rejoin?</a></p>}
        </div>
    );
}

export default Home;