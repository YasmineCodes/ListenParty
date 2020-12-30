import React, { Component } from "react"; 
import RoomJoinPage from "./RoomJoinPage"; 
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room"; 
import {
    BrowserRouter as Router,
    Route, Switch, Link, Redirect
} from "react-router-dom"; 


export default class HomePage extends Component { 
    constructor(props) { 
        super(props); 
    }

    render() { 
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component=""> <p> This is the home page.</p> </Route>
                    <Route path="/join" component={RoomJoinPage}></Route>
                    <Route path="/create" component={CreateRoomPage}></Route>
                    <Route path="/room/:roomCode" component={Room}></Route>
                </Switch>
            </Router>
        ); 
    }
}