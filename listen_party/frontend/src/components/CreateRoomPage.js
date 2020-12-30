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
    RadioGroup,
    Collapse,
} from '@material-ui/core'; 
import Alert from "@material-ui/lab/Alert"; 


export default class CreateRoomPage extends Component { 
    static defaultProps = {
        votesToSkip: 2,
        guestCanPause: true,
        update: false,
        roomCode: null,
        updateCallback: () => {},
    }; 
    defaultVotes = 2; 
    constructor(props) { 
        super(props); 
        this.state = {
            guestCanPause: this.props.guestCanPause,
            votesToSkip: this.props.votesToSkip,
            errorMsg: "", 
            successMsg: "",
        }; 
        this.handleCreateRoom = this.handleCreateRoom.bind(this); 
        this.handleSkipVotes = this.handleSkipVotes.bind(this); 
        this.handleGuestCanPauseUpdate = this.handleGuestCanPauseUpdate.bind(this); 
        this.handleUpdateRoom = this.handleUpdateRoom.bind(this); 
    }

    //handle updates to votes to skip 
    handleSkipVotes(e) { 
        this.setState({
            votesToSkip: e.target.value, //update votes to skip 
        }); 
    }
    //handle updates to Guest Pause permission
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

    handleUpdateRoom() { 
        const requestOptions = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
                code: this.props.roomCode,
                }),
        };
        fetch("/api/update-room/", requestOptions).then((response) => {
            if (response.ok) {
                this.setState({
                successMsg: "Room updated successfully!",
                });
            } else {
                this.setState({
                errorMsg: "Error updating room...",
                });
            }
            this.props.updateCallback(); 
        });
        
    }

    renderCreateButtons() { 
        return (
            <Grid container spacing={1}>
                 <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={this.handleCreateRoom}>
                        Create
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>
                        Back
                    </Button>
                 </Grid>
            </Grid>
        ); 

    }

    renderUpdateButtons() { 
        return (
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={this.handleUpdateRoom}>
                    Update
                </Button>
            </Grid>
        ); 
    }


    render() { 
        const title = this.props.update ? "Update Room" : "Create a Room"
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Collapse
            in={this.state.errorMsg != "" || this.state.successMsg != ""}
          >
            {this.state.successMsg != "" ? (
              <Alert
                severity="success"
                onClose={() => {
                  this.setState({ successMsg: "" });
                }}
              >
                {this.state.successMsg}
              </Alert>
            ) : (
              <Alert
                severity="error"
                onClose={() => {
                  this.setState({ errorMsg: "" });
                }}
              >
                {this.state.errorMsg}
              </Alert>
            )}
          </Collapse>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        {title}
                    </Typography> 
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            <div align="center"> Guest control of playback state</div>
                            <RadioGroup
                                row
                                defaultValue={this.props.guestCanPause.toString()}
                                onChange={this.handleGuestCanPauseUpdate}>
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
                            defaultValue={this.state.votesToSkip}
                            onChange={this.handleSkipVotes}
                            inputProps={{ min: 1, style:{textAlign: "center"} }} />
                        <FormHelperText>
                            <div align="center">
                                Votes Required to Skip Song
                            </div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                {this.props.update ? this.renderUpdateButtons() : this.renderCreateButtons()}
            </Grid>
        ); 
    }
}