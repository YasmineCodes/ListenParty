import React, { Component } from "react"; 
import { render } from "react-dom"; 
import HomePage from "./HomePage"
import RoomJoinPage from "./RoomJoinPage"; 
import CreateRoomPage from "./CreateRoomPage"; 

export default class App extends Component { 
    constructor(props) { 
        super(props); 
    }
    render() { 
        return (
            <div className="center">
                <HomePage /> 
            </div>
        ); 
    }
}

// saving html element that will hold the react app 
const appDiv = document.getElementById("app"); 
//rendering the App component created above inside the selected appDiv element
render(<App />, appDiv); 
