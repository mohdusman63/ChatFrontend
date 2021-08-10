import HomeContainer from "./component/HomeContainer";
import React, {useState, useEffect} from "react";
import {Card, Button, Spinner} from 'react-bootstrap'
import io from "socket.io-client";
import logo from './chat.png'


let socket;
let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzbWFuQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJGJPTnJhVi9YNk85dWxqbkNUaWlZdHU5TkQzSFN1Vk9hNnIyeDkvUVN6Ri51bUVuR0dTOVBlIiwiZmFjZWJvb2tfaWQiOiIiLCJuYW1lIjoiIiwicGhvbmUiOm51bGwsImlzX3Byb2ZpbGVfY3JlYXRlZCI6ZmFsc2UsImdvb2dsZV9pZCI6IiIsImxpbmtlZGluX2lkIjoiIiwiaXNfYWNjb3VudF92ZXJpZnkiOmZhbHNlLCJzdGF0dXMiOmZhbHNlLCJsYXN0X2xvZ2luIjoiMjAyMS0wOC0wNlQwODo1MzowMS43NDVaIiwiaXNfY29tcGFueV9jcmVhdGVkIjpmYWxzZSwiX2lkIjoiNjEwY2Y4ZjQxNzk3NjYzOTI4M2MyZTU5IiwiYWNjb3VudF90eXBlIjoiam9iX3NlZWtlciIsInNpZ251cF9tZXRob2QiOiJsb2NhbCIsImNyZWF0ZWRBdCI6IjIwMjEtMDgtMDZUMDg6NTU6MTYuNDE5WiIsInVwZGF0ZWRBdCI6IjIwMjEtMDgtMDZUMDg6NTU6MTYuNDE5WiIsIl9fdiI6MCwiaWF0IjoxNjI4MjQwMTE2LCJleHAiOjE2MjkxMDQxMTZ9.PQGZpH-uFKIc7hnWcwgWgGBlbrF6r6gvtiyOIYdyGFY"
//const CONNECTION_PORT = "https://immense-island-25591.herokuapp.com";

const CONNECTION_PORT = "http://localhost:3001";
function App() {
    const [roomId, setRoomId] = useState('')
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    const [typing, setTyping] = useState('')
    const [listMessage, setListMessage] = useState('')
    const [display, SetDisplay] = useState(false)
    const [loading, SetLoading] = useState(false)
    const [joinedRoom, setJoinedRoom] = useState("");
    const [error, SetError] = useState(null)

    useEffect(() => {
        socket =  io.connect(CONNECTION_PORT,{query: {token: token}});

    }, [CONNECTION_PORT]);

    useEffect(() => {
        socket.on("joined_room", (msg) => {
            //console.log('rece'+msg)
            let message = `${msg}  Joined The Room`
            setJoinedRoom(message)
        });
    },[socket]);

    useEffect(() => {
        socket.on("connect_error", (err) => {
            console.log(err instanceof Error); // true
            console.log(err.message); // not authorized

        });

    },[socket])
    useEffect(() => {
        socket.on("receive_message", (msg) => {
            //console.log('rece'+msg)
            setListMessage(msg)
        });
    },[socket]);

    if(socket) {
        socket.on("typing", (msg) => {
            setTyping(msg)
            console.log('typing' + msg)

        });
        setTimeout(() => {
            setTyping('')

        }, 4000)
    }


    const connectToRoom = () => {
        if(! roomId || !name ){
            SetError('Input Field Required')
            return
        }
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
    if(socket) {
        socket.on("disconnect", () => {
            console.log(socket.id); // undefined
        });
    }
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
                <Card.Header className="bg-success"><img src={logo} width={30}/></Card.Header>
                <Card.Body>

                    <Card.Text>
                        <input type="number" className="form-control" placeholder="Enter Room Id " value={roomId}
                               onChange={(e) => setRoomId(e.target.value)}/>
                        <input type="text" className="form-control mt-3" placeholder="Enter Name" value={name}
                               onChange={(e) => setName(e.target.value)}/>

                        {error&&<div className="text-danger">{error}</div>}

                    </Card.Text>
                    <Button variant="primary" onClick={connectToRoom}>
                        {loading ?
                            <>  <Button variant="primary"  disabled>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                Loading...
                            </Button>

                            </>
                            : <span className="ml-4">
                        Join Room
                        </span>}


                    </Button>

                </Card.Body>
                <Card.Footer className="text-muted bg-dark">&#9829;
                    Developed By Usman
                </Card.Footer>
            </Card>}

            {display &&
            <HomeContainer roomId={roomId} socket={socket} listMessage={listMessage} name={name} typing={typing}
                           joinedRoom={joinedRoom}/>}

        </div>
    );
}

export default App;
