import React from "react";
import '../css/JoinGame.css';

function JoinGame(props) {
    return(
        <button className="JoinGameButton" onClick={props.openMenu}>
            Join Game!
        </button>
    );
}

export default JoinGame;