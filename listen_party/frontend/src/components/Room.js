import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";
import SpotifyPlayer from "react-spotify-web-playback";
import Alert from "@material-ui/lab/Alert";

//TODO: Create chatbox component
//TODO: create callback function for spotify player to prompt guest to activate their spotify app and to prompt with listen through the browser hint
//TODO: make sure room is being deleted on leave
//TODO: add guest list to room model and update with guest entries

export default class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSettings: false,
            spotifyAuthenticated: false,
            spotifyActive: false,
            accessToken: '',
            song: {}
        };
        this.roomCode = this.props.match.params.roomCode;
        this.handleLeaveRoom = this.handleLeaveRoom.bind(this);
        this.updateShowSettings = this.updateShowSettings.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.authenticateSpotify = this.authenticateSpotify.bind(this);
        this.getCurrentSong = this.getCurrentSong.bind(this);
        this.getRoomDetails();
    }

    getRoomDetails() {
        this.authenticateSpotify();
        fetch("/api/get-room/" + "?code=" + this.roomCode)
            .then((response) => {
                if (!response.ok) {
                    this.props.leaveRoomCallback();
                    this.props.history.push("/");
                }
                return response.json()
            })
            .then((data) => {
                this.setState({
                    votesToSkip: data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost: data.is_host,
                });
            });
    }

    authenticateSpotify() {
        fetch("/spotify/is-spotify-authenticated/")
            .then((response) => response.json())
            .then((data) => {
                this.setState({ spotifyAuthenticated: data.status, accessToken: data.access_token });
                if (!data.status) {
                    fetch('/spotify/get-auth-url/')
                        .then((response) => response.json())
                        .then((data) => {
                            window.location.replace(data.url);
                        });
                }
            });
    }
    componentDidMount() {
        //Calls get current song every 1000 m.seconds (1 sec) while component is mounted
        this.interval = setInterval(this.getCurrentSong, 1000);
    }
    // Stop calls when unmounting
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    getCurrentSong() {
        fetch("/spotify/current-song/")
            .then((response) => {
                if (response.status == 204) {
                    this.setState({ spotifyActive: false });
                    return {}; //TODO: build placeholder for player for when nothing is returned
                } else {
                    this.setState({ spotifyActive: true });
                    return response.json();
                }
            })
            .then((data) => {
                this.setState({ song: data });
                if (this.state.song.skip_votes === this.state.song.votes_needed) {
                    this.skipSong();
                }
            });


    }

    syncGuest() {
        console.log("sync-guest")
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/spotify/sync-guest/", requestOptions)
            .then((response) => {
                console.log(response);
                if (response.status == 204) {
                    console.log("Guest Synced");
                }
            })
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

    handleLeaveRoom() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/api/leave-room/", requestOptions)
            .then((_response) => {
                this.props.leaveRoomCallback();
                this.props.history.push("/");
            });
    }

    updateShowSettings(value) {
        this.setState({ showSettings: value });
    }

    renderSettingsButton() {
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={() => this.updateShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        );
    }

    renderSettings() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPage update={true} votesToSkip={this.state.votesToSkip} guestCanPause={this.state.guestCanPause} roomCode={this.roomCode} updateCallback={this.getRoomDetails}/>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={() => this.updateShowSettings(false)}>Close</Button>
                </Grid>
            </Grid>
        );
    }

    renderMusicPlayer() {
        {/* passing music player song object using the spread operator */}
        return <MusicPlayer {...this.state.song} />;
    }

    render() {
        let uri = this.state.song.uri;
        const accessToken = this.state.accessToken
        if (this.state.showSettings) {
            return this.renderSettings();
        }
        return (
            <Grid container spacing={1}>
                <div>
                    <SpotifyPlayer
                        token={accessToken}
                        syncExternalDevice={true}
                        name="Listen Party"
                    />
                </div>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Code: { this.roomCode}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    {this.state.spotifyActive ? this.renderMusicPlayer() :
                    (<Alert align="center" width={1} severity="warning" variant="outlined">Make sure the host's spotify app is active.</Alert>) }
                </Grid>


                {/* show settings button if is host */}
                {this.state.isHost ? this.renderSettingsButton() : null}
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={this.handleLeaveRoom}>
                        Leave Room
                    </Button>
                </Grid>
            </Grid>
        )
    }

}

{               /* <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                       Guest Can Pause: {this.state.guestCanPause.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Votes to Skip: {this.state.votesToSkip}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Host: {this.state.isHost.toString()}
                    </Typography>
                </Grid> */}
