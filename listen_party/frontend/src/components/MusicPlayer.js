import React, { Component } from "react"; 
import { Grid, Typography, Card, IconButton, LinearProgress, Collapse } from "@material-ui/core"; 
import "./app.css"; 
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import Alert from "@material-ui/lab/Alert"; 


export default class MusicPlayer extends Component { 
    constructor(props) { 
        super(props); 
        this.state = {guest_permission: true }; 
    }

    pauseSong() { 
        const requestOptions = {
            method: "Put",
            headers: { "Content-Type": "application/json" },
        }; 
        fetch("/spotify/pause/", requestOptions)
            .then((response) => {
                if (response.status == 403) {
                    this.setState({ guest_permission: false }); 
                }
            });
    }
    playSong() { 
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        }; 
        fetch("/spotify/play/", requestOptions)
        .then((response) => {
                if (response.status == 403) {
                    this.setState({ guest_permission: false }); 
                }
            });
    }

    skipSong() { 
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        }; 
        fetch("/spotify/skip/", requestOptions)
        .then((response) => {
                if (response.status == 403) {
                    this.setState({ guest_permission: false }); 
                }
            });
    }

    
    render() { 
        const songProgress = (this.props.progress / this.props.duration) * 100;
        return (
            <Card className="musicPlayer">
            <Grid container alignItems="center">
                <Grid item align="center"  sm={12} xs={12} md={5} id="trackImage">
                    <img src={this.props.image_url} height="100%" width="100%" />
                </Grid>
                <Grid item align="center" xs={12} md={7}>
                    <Typography component="h5" variant="h6" className="musicPlayerElement" id="songTitle" >
                        {this.props.title}
                    </Typography>
                    <Typography variant="subtitle1" className="musicPlayerElement">
                        {this.props.artist}
                    </Typography>
                    <div >
                        <IconButton onClick={() => {this.props.is_playing ? this.pauseSong() : this.playSong()}}>
                            {this.props.is_playing ? <PauseIcon/> : <PlayArrowIcon/>}
                        </IconButton>
                        <IconButton onClick={()=> this.skipSong()}>
                            <SkipNextIcon /> {" "}{this.props.skip_votes}/{" "}{this.props.votes_needed}
                        </IconButton>
                    </div>
                </Grid>
                <Grid item xs={12} align="center">
                    <Collapse in={!this.state.guest_permission} >
                        {!this.state.guest_permission  ? (
                            <Alert severity="error" onClose={() => this.setState({guest_permission:true})}>
                                You don't have permission to play/pause. 
                            </Alert>
                        ) : null}
                    </Collapse>
                </Grid>
            </Grid>
            <LinearProgress variant="determinate" value={songProgress} />
        </Card>); 
    }
}