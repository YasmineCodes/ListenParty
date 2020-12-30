import React, { Component } from "react"; 
import {
    Button,
    Grid,
    Typography,
    TextField,
} from '@material-ui/core'; 
import { Link } from "react-router-dom"; 

export default class RoomJoinPage extends Component{ 
    constructor(props) { 
        super(props);
        
        this.state = {
            roomCode: "",
            error: ""
        }; 
        this.handleRoomEntryUpdate = this.handleRoomEntryUpdate.bind(this); 
        this.handleEnterRoom = this.handleEnterRoom.bind(this); 
    }
    handleRoomEntryUpdate(e) { 
        this.setState({
            roomCode: e.target.value,
        }); 
    }
    handleEnterRoom() { 
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                    code: this.state.roomCode}),
        }; 
        fetch("/api/join-room/", requestOptions)
            .then((response) => {
                if (response.ok) {
                    this.props.history.push(`/room/${this.state.roomCode}`);
                } else {
                    this.setState({ error: "Room not found" });
                }
            }).catch((error) => {
                console.log(error);
            }); 
    }
    render() { 
        return (
            <Grid container spacing={1} >
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4"> Join a Room</Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <TextField
                        error={this.state.error}
                        label="Code"
                        placeholder="Enter a Room Code"
                        value={this.state.roomCode}
                        helperText={this.state.error}
                        variant="outlined" 
                        onChange={this.handleRoomEntryUpdate}
                        />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="primary" onClick={this.handleEnterRoom}>Enter Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" to="/" component={Link}>Back
                    </Button>
                </Grid>
            </Grid>
        ); 
    }
}