import React, { Component } from "react"; 
import { Link } from "react-router-dom"; 
import {
    Button,
    Grid,
    Typography,
    TextField,
    FormControl,
    FormControlLabel, 
    FormHelperText,
    Radio, 
    RadioGroup
} from '@material-ui/core'



export default class CreateRoomPage extends Component { 
    defaultVotes = 2; 
    constructor(props) { 
        super(props); 
        this.state = {
            guestCanPause: true,
            votesToSkip: this.defaultVotes,
        }; 
        this.handleCreateRoom = this.handleCreateRoom.bind(this); 
        this.handleSkipVotes = this.handleSkipVotes.bind(this); 
        this.handleGuestCanPauseUpdate = this.handleGuestCanPauseUpdate.bind(this); 
    }

    //handle updates to votes to skip 
    handleSkipVotes(e) { 
        this.setState({
            votesToSkip: e.target.value, //update votes to skip 
        }); 
    }
    //handle updates to Gues Pause permission
    handleGuestCanPauseUpdate(e) { 
        this.setState({
            guestCanPause: e.target.value === "true" ? true : false,
        }); 
    }

    //handle create room event
    handleCreateRoom() { 
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify({
                    votes_to_skip: this.state.votesToSkip,
                    guest_can_pause: this.state.guestCanPause
                }),
        }; 
        fetch("/api/create-room/", requestOptions)
            .then((response) => response.json())
            .then((data) => 
                this.props.history.push("/room/" + data.code)
                
            );     
    }



    render() { 
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        Create a Room
                    </Typography> 
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            <div align="center"> Guest control of playback state</div>
                            <RadioGroup row defaultValue="true" onChange={this.handleGuestCanPauseUpdate}>
                                <FormControlLabel
                                    value="true" control={<Radio color="primary"></Radio>} label="Play/Pause"
                                    labelPlacement="bottom" />
                                 <FormControlLabel
                                    value="false" control={<Radio color="secondary"></Radio>} label="No Control"
                                    labelPlacement="bottom" />
                            </RadioGroup>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField
                            required={true}
                            type="number"
                            defaultValue={this.defaultVotes}
                            onChange={this.handleSkipVotes}
                            inputProps={{ min: 1, style:{textAlign: "center"} }} />
                        <FormHelperText>
                            <div align="center">
                                Votes Required to Skip Song
                            </div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={this.handleCreateRoom}>
                        Create a Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>Back
                    </Button>
                 </Grid>
            </Grid>
        ); 
    }
}