import React, { Component } from "react"; 
import { Grid, Typography, Card, IconButton, LinearProgress, Collapse } from "@material-ui/core"; 
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
        return (<Card>
            <Grid container alignItems="center">
                <Grid item align="center" xs={4}>
                    <img src={this.props.image_url} height="100%" width="100%" />
                </Grid>
                <Grid item align="center" xs={8}>
                    <Typography component="h5" variant="h5">
                        {this.props.title}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1">
                        {this.props.artist}
                    </Typography>
                    <div>
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