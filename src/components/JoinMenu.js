import React, {useState} from "react";
import "../css/JoinMenu.css"
import { FaWindowClose } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function JoinMenu(props) {

  const [password, setPassword] = useState('');
  const [gameID, setGameID] = useState(NaN);

  const navigate = useNavigate()

  const joinGame = ()=>{
    if(isNaN(gameID)){props.assignPopup("Invalid ID"); return}
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        { 
          id: gameID,
          password: password,
          name: props.name,
        }
      )
    };
    fetch(`${process.env.REACT_APP_DEV_API_URI}/joingame`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if(data.token === null || data.token === undefined){
          props.assignPopup("Invalid Game Credentials")
          return
        }
        props.assignToken(data.token);
        navigate('/anagrams');
      }).catch((err)=>{console.log("error getting token");props.assignPopup("Couldn't Connect To Server"); return});
  }
  
  return (
    <div className="overlay">
        <div className="content">
            <button className="CloseButton" onClick={props.closeMenu}><FaWindowClose/></button>
            <div className="InputWrapper">
                <label htmlFor="gameid">ID: </label>
                <input type="number" name="gameid" className="IDInput" maxLength="4" onChange={(e)=>{setGameID(parseInt(e.target.value))}}/>
            </div>
            <div className="PasswordInputWrapper">
                <label >Enter Password: </label>
                <input className="PasswordInput" onChange={(e)=>{setPassword(e.target.value)}}/>
            </div>
            <button className="JoinButton" onClick={()=>{joinGame()}}>Join!</button>
        </div>
    </div>
  );
}

export default JoinMenu;