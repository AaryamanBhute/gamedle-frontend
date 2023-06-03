import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Popup from "./Popup.js"
import Home from "./Home.js"
import AnagramsGame from "./AnagramsGame.js";
import "../css/App.css"

function App() {

  const [name, setName] = React.useState(sessionStorage.getItem("name"))
  const [popup, setPopup] = React.useState(null)
  const [token, setToken] = React.useState(sessionStorage.getItem("token"))

  useEffect(()=>{
    if(name !== null){
      sessionStorage.setItem("name", name)
    }
    else{
      sessionStorage.removeItem("name")
    }
    if(token !== null){
      sessionStorage.setItem("token", token)
    }
    else{
      sessionStorage.removeItem("token")
    }
  }, [name, token])

  useEffect(()=>{
    console.log("token changed to: " + token)
  }, [token])

  return (
    <BrowserRouter>
      {popup == null ? null : <Popup message={popup} assignPopup={setPopup}/>}
      <Routes>
        <Route index element={<Home assignName={setName} assignPopup={setPopup} assignToken={setToken} name={name} token={token}/>}/>
        <Route path="/anagrams" element={<AnagramsGame assignPopup={setPopup} name={name} token={token} assignToken={setToken}/>}/>
        <Route path="*" element={<Home assignName={setName} assignPopup={setPopup}  assignToken={setToken} name={name} token={token}/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;