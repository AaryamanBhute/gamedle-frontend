import React, {useCallback, useState, useEffect} from "react";
import '../css/AnagramsGame.css';
import { FaExchangeAlt } from "react-icons/fa";
import jwt from 'jwt-decode'
import { socket } from '../socket';
import { useNavigate } from 'react-router-dom';
import Timer from "./Timer";

function AnagramsGame(props) {

    const info = jwt(props.token)
    const navigate = useNavigate()

    const [letters, setLetters] = useState(info.letters)
    const [curWord, setCurWord] = useState([])
    const [blocked, setBlocked] = useState([])
    const [words, setWords] = useState([])
    const [score, setScore] = useState(0)
    const [players, setPlayers] = useState([])
    const [finished, setFinished] = useState(false)

    useEffect(()=>{
        console.log(words)
    }, [words])
    
    useEffect(() => {
        function onConnect() {
            socket.emit('join game', props.token)
        }

        function onJoinFail(){
            props.assignPopup(`Your Game Doesn't Exist`);
            props.assignToken(null)
            navigate('/')
        }

        function onFinish(){
            setFinished(true)
        }

        function updateWords(data){
            var info = JSON.parse(data)
            setWords(info.words)
            setScore(info.score)
        }

        function updatePlayers(data){
            var info = JSON.parse(data)
            console.log(info.players)
            setPlayers(info.players)
        }
    
        function onDisconnect() {
            console.log("disconnected")
            props.assignPopup(`Something Went Wrong`)
            props.assignToken(null)
            navigate('/')
        }

        function handleErrors(err){
            console.log("socket error")
            props.assignPopup(`Something Went Wrong`)
            props.assignToken(null)
            navigate('/')
        }

        function invalidWord(){
            props.assignPopup("Invalid Word")
        }

        console.log("connecting")

        socket.connect()        
        socket.on('connect', onConnect);
        socket.on('join fail', onJoinFail);
        socket.on('updated players', updatePlayers)
        socket.on('disconnect', onDisconnect);
        socket.on('connect_error', err => handleErrors(err))
        socket.on('connect_failed', err => handleErrors(err))
        socket.on('finished', onFinish);

        // anagrams
        socket.on('anagrams updated words', updateWords)
        socket.on('anagrams failed word', invalidWord)
    
        return () => {
            socket.off('connect', onConnect);
            socket.off('join fail', onJoinFail);
            socket.off('updated players', updatePlayers)
            socket.off('disconnect', onDisconnect);
            socket.off('connect_error', err => handleErrors(err))
            socket.off('connect_failed', err => handleErrors(err))
            
            // anagrams
            socket.off('anagrams updated words', updateWords)
            socket.off('anagrams failed word', invalidWord)
        };
      }, []);

    const gamePage = useCallback((inputElement) => {
        if (inputElement) {
          inputElement.focus();
        }
    }, []);

    const shuffle = (array)=>{
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle.
        while (currentIndex !== 0) {
      
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
    }

    const scramble = ()=>{
        const new_letters = shuffle(letters)
        const new_blocked = []
        for(let i = 0; i < curWord.length; i++){
            for(let j = 0; j < letters.length; j++){
                if(new_blocked.includes(j)){continue}
                if(new_letters[j] === curWord[i]){
                    new_blocked.push(j)
                    break
                }
            }
        }
        setLetters(new_letters)
        setBlocked(new_blocked)
    }

    const addLetter = (letter) =>{
        console.log("called: " + letter)
        for (let i = 0; i < letters.length; i++){
            if(blocked.includes(i)){continue}
            if(letters[i] === letter){
                setBlocked(blocked.concat([i]))
                setCurWord(curWord.concat([letter]))
                return
            }
        }
        props.assignPopup("Invalid Letter")
    }

    const deleteLetter = () =>{
        if(curWord.length === 0){
            props.assignPopup("Your Word Is Empty")
            return
        }
        let l = curWord[curWord.length - 1]
        for (let i = letters.length - 1; i >= 0; i--){
            if(letters[i] === l && blocked.includes(i)){
                let ind = blocked.indexOf(i)
                setBlocked(blocked.slice(0, ind).concat(blocked.slice(ind+1, blocked.length)))
                setCurWord(curWord.slice(0, curWord.length-1))
                return
            }
        }
        props.assignPopup("Something Went Wrong, Try Refreshing")
    }

    const submitWord = () =>{
        console.log('sending word', curWord.join(''))
        socket.emit('anagrams submit word', props.token, curWord.join(''));
    }

    const handleKeyPress = (event) => {
        if(event.key === 'Backspace'){
            deleteLetter()
            return
        }
        else if(event.key === 'Enter'){
            submitWord()
            return
        }
        addLetter(event.key)
    }

    return(
        <div className="GamePage" onKeyDown={handleKeyPress} tabIndex="1" ref={gamePage}>
            <div className="PageWrapper">
                <div>
                    <p className="GameID">Game ID: {info.id}</p>
                    <Timer startTime={info.start_time}/>
                    <div className="content">
                        <p>Finished: {finished.toString()}</p>
                        <p>Your Score: {score}</p>
                        <p>Available Letters:</p>
                        <div className="LettersWrapper">
                            <div className="Letters">
                                {letters && letters.map((letter, ind)=>
                                    <div className={blocked.includes(ind) ? "Letter Used" : "Letter"}><p>{letter}</p></div>
                                )}
                            </div>
                            <FaExchangeAlt className="ScrambleIcon" onClick={scramble}/>
                        </div>
                        
                        <p>Current Word:</p>
                        <div className="CurWord">
                            {curWord.map((letter)=>
                                <div className="Letter"><p>{letter}</p></div>
                            )}
                            {curWord.length === 0 ?<div className="BlankWrapper"><p className="Blank">&nbsp;</p></div>  : null}
                        </div>
                        <button onClick={submitWord}>Submit</button>
                    </div>
                </div>
                <div className="SubmittedWords">
                    <p>Submitted Words: </p>
                    {words.map((w, i)=>
                        <p>{i + 1}: {w}</p>
                    )}
                </div>
                <div className="PlayerScores">
                    <p>Player Infos: </p>
                    {players.map((e)=>
                        <p>{e.PlayerName} - {e.Score}</p>
                    )}
                </div>
            </div>
            
        </div>
    );
}

export default AnagramsGame;