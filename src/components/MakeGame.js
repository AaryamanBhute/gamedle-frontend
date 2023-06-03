import React from "react";
import '../css/MakeGame.css';

function MakeGame(props) {
    return(
        <button className="MakeGameButton" onClick={props.openMenu}>
            Start New Game!
        </button>
    );
}

export default MakeGame;