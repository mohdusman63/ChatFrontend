import HomeContainer from "./component/HomeContainer";
import React, {useState, useEffect} from "react";
import {Card, Button, Spinner} from 'react-bootstrap'
import io from "socket.io-client";

let socket;
const CONNECTION_PORT = "https://immense-island-25591.herokuapp.com";

function App() {
    const [roomId, setRoomId] = useState('')
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    const [typing, setTyping] = useState('')
    const [listMessage, setListMessage] = useState('')
    const [display, SetDisplay] = useState(false)
    const [loading, SetLoading] = useState(false)
    useEffect(() => {
        socket = io(CONNECTION_PORT);
    }, [CONNECTION_PORT]);

    useEffect(() => {
        socket.on("receive_message", (msg) => {
            //console.log('rece'+msg)
            setListMessage(msg)
        });
    });

    useEffect(() => {
        socket.on("typing", (msg) => {
            setTyping(msg)
            console.log('typing' + msg)

        });
        setTimeout(() => {
            setTyping('')

        }, 4000)
    });

    const connectToRoom = () => {
        SetLoading(true)
        let data = {
            roomId: roomId,
            name: name
        }
        socket.emit("join_room", data, (req) => {
            console.log(req)
            SetDisplay(true)
        });
    };
    const sendMessage = () => {
        let data = {
            message: message,
            roomId: roomId
        }
        socket.emit("send_message", data, (req) => {
            console.log('msg' + req)
        })
    }

    return (
        <div className="App col-md-6 mx-auto mt-5">
            {!display && <Card className="text-center">
                <Card.Header>Chat App</Card.Header>
                <Card.Body>

                    <Card.Text>
                        <input type="number" className="form-control" placeholder="Enter Room Id " value={roomId}
                               onChange={(e) => setRoomId(e.target.value)}/>
                        <input type="text" className="form-control mt-3" placeholder="Enter Name" value={name}
                               onChange={(e) => setName(e.target.value)}/>

                    </Card.Text>
                    <Button variant="primary" onClick={connectToRoom}>
                        {loading ?
                            <>
                                     <span className="">
                               Joining  Room  ....
                                </span>
                                <Spinner
                                    className={"ml-3"}
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />

                            </>
                            : <span className="ml-4">
                        Join Room
                        </span>}


                    </Button>

                </Card.Body>
                <Card.Footer className="text-muted">&#9829;
                    2 Day Ago
                </Card.Footer>
            </Card>}

            {display &&
            <HomeContainer roomId={roomId} socket={socket} listMessage={listMessage} name={name} typing={typing}/>}

        </div>
    );
}

export default App;
