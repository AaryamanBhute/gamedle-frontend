import React, { useState } from "react";
import "../css/SelectMenu.css"
import { FaWindowClose } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function SelectMenu(props) {

  const getInitialState = () => {
    const value = "Anagrams";
    return value;
  };

  const [game, setGame] = useState(getInitialState)
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  const createGame = ()=>{
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        { 
          game_type: game,
          password: password,
          name: props.name,
        }
      )
    };
    console.log(requestOptions.body)
    fetch(`${process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URI : process.env.REACT_APP_DEV_API_URI}/makegame`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if(data.token === null || data.token === undefined){
          console.log("invalid response")
        }
        props.assignToken(data.token);
        navigate('/anagrams');
      }).catch((err)=>{console.log("error getting token", err);props.assignPopup("Couldn't Connect To Server"); return});
  }

  return (
    <div className="overlay">
        <div className="content">
            <button className="CloseButton" onClick={props.closeMenu}><FaWindowClose/></button>
            <select name="choices" id="choices" onChange={(e)=>{setGame(e.target.value)}}>
            {props.choices && props.choices.map((choice, index) =>
                <option value={props.choices[index]}>{props.choices[index]}</option>
            )}
            </select>
            <div className="PasswordInputWrapper">
                <label >Enter Password: </label>
                <input className="PasswordInput" onChange={(e)=>{setPassword(e.target.value)}}/>
            </div>
            <button className="CreateButton" onClick={createGame}>Create!</button>
        </div>
    </div>
  );
}

export default SelectMenu;