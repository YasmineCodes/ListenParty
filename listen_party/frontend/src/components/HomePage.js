import React, { Component } from "react"; 
import RoomJoinPage from "./RoomJoinPage"; 
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room"; 
import {
    Button,
    ButtonGroup,
    Grid,
    Hidden,
    Typography,
} from '@material-ui/core'; 
import {
    BrowserRouter as Router,
    Route, Switch, Link, Redirect
} from "react-router-dom"; 


export default class HomePage extends Component { 
    constructor(props) { 
        super(props); 
        this.state = {
            roomCode: null
        }; 
        this.clearRoomCode = this.clearRoomCode.bind(this); 
    }

    //Called  when rendered, forces component to re-render 
    async componentDidMount() { 
        fetch("/api/user-in-room/")
            .then((response) => response.json())
            .then((data) => {
                this.setState({roomCode: data.code}); 
            }); 
    }

    renderHomePage() { 
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h3" style={{fontStyle:"italic", fontWeight:"bold"}}>
                        Listen Party
                    </Typography>
                    <Typography variant="substitle1" style={{fontStyle:"italic"}} gutterBottom>
                        <Hidden only="xs"> Jam, dance, learn, or laugh with friends. </Hidden> Use your Spotify premium account to listen to your favorite music and podcasts together with listen party.
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to="/join" component={Link}>
                            Join a Room
                        </Button>
                        <Button color="secondary" to="/create" component={Link}> 
                            Create a Room
                        </Button>
                    </ButtonGroup>
                 </Grid>
            </Grid>
        ); 
    }
    clearRoomCode() { 
        this.setState({ roomCode: null, }); 
    }

    render() { 
        return (
            <Router>
                <Switch>
                    <Route exact path="/"
                        render= {() => {
                            return this.state.roomCode ? (<Redirect to={`/room/${this.state.roomCode}`} />) : this.renderHomePage();}}/>
                    <Route path="/join" component={RoomJoinPage}></Route>
                    <Route path="/create" component={CreateRoomPage}></Route>
                    <Route path="/room/:roomCode"
                        render={
                            (props) => {
                                return <Room {...props} leaveRoomCallback={this.clearRoomCode} />
                            }}
                        
                    ></Route>
                </Switch>
            </Router>
        ); 
    }
}