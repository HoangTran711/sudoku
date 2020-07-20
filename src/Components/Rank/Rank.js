import React, {useEffect,useState} from 'react'
import {Table} from 'react-bootstrap'
import './Rank.css'

function Rank() {
    const [player,setPlayer] = useState([]);
    const allPlayer = [];
    useEffect(() => {
        fetch('https://webapp-a9efe.firebaseio.com/player.json')
        .then((res)=> res.json())
        .then((resData) => {
            var count = 0;
            for(const key in resData) {
                count++;
                allPlayer.push(
                        {
                            id:key,
                            player:resData[key].player,
                            time:resData[key].time
                        }
                    )
            }
            for(let i = 0; i < count; i++){
                for(let j = 0; j < count;j++){
                    if(allPlayer[i].time < allPlayer[j].time){
                        var temp = allPlayer[i];
                        allPlayer[i]= allPlayer[j];
                        allPlayer[j] = temp;
                    }
                }
            }
            setPlayer(allPlayer)
        })
        .catch((err) => {
            console.log(err);
        })
    });
    return (
        <div className="Rank">
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Player's Name</th>
                    <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        player.map((a,id) => {
                            return (<tr>
                                <td>{id+1}</td>
                                <td>{a.player}</td>
                                <td>{a.time}</td>
                            </tr>)
                        })
                    }
                </tbody>
            </Table>
        </div>
    )
}

export default Rank
