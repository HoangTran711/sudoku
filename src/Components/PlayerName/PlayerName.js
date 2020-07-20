import React, {useState, useContext}from 'react'
import { useTimer } from 'use-timer';
import Data from '../data/MyContext'
import {Button,InputGroup,FormControl,Form} from 'react-bootstrap'
import './PlayerName.css'

function PlayerName() {
    const data  = useContext(Data);
    let greet;
    const changeHandle = (e) => {
        data.setName(e.target.value);
        
    }
    let record;
    const [displayName, setDisplay] = useState('');
    const { time, start, pause, reset, isRunning } = useTimer();
    const clickHandle = () => {
        if(data.name != ''){
            start();
            setDisplay(data.name);
            data.setControlTime({
                pause:pause,
                reset:reset,
                start:start
            })
        }
        
    }
    const submitHandle = () => {
        const account = {
            player: displayName,
            time:time
        }
        fetch('https://webapp-a9efe.firebaseio.com/player.json',
            {
                method:"POST",
                body: JSON.stringify(account),
                headers: {"Content-Type":"application/JSON"}
            }
        ).then((result) => {
            alert(`Successfully`)
        })
        .catch((err) => {
            console.log(err);
        })
    }
    if(displayName != '') {
        greet = <h5>Xin Chào! <b> {displayName} </b></h5>
    } else {
        greet=null
    }
    if(data.complete) {
        record = <Button variant="outline-light" onClick={submitHandle}>Record</Button>
    } else {
        record = null
    }
    return (
        <div className="PlayerName">
            {greet}
            <div className="enterForm">
                {(displayName== '')?<InputGroup id="inputF" className="mb-3" onChange={changeHandle}>
                    <FormControl

                    placeholder="Your Name..."
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    />
                </InputGroup>: <InputGroup id="inputF" className="mb-3" onChange={changeHandle}>
                    <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroup-sizing-default">Player's Name</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control type="text" placeholder={displayName} readOnly />
                </InputGroup>
                }
                {(displayName == '')?<Button variant="outline-light" onClick={clickHandle}>Submit</Button>:null}
                {record}
            </div>
            
            {(displayName != '')?<div className="Time">
                <p>Elapsed time: {time}</p>
            </div>:null}
        </div>
    )
}

export default PlayerName
