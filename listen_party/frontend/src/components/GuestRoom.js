import React, { Component } from "react"; 
import Room from "./Room"; 


export default class Room extends Component { 
    constructor(props) { 
        super(props); 
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
        }; 
        this.roomCode = this.props.match.params.roomCode; 
        // this.handleLeaveRoom = this.handleLeaveRoom.bind(this); 
        // this.updateShowSettings = this.updateShowSettings.bind(this); 
        // this.renderSettingsButton = this.renderSettingsButton.bind(this); 
        // this.renderSettings = this.renderSettings.bind(this); 
        // this.getRoomDetails = this.getRoomDetails.bind(this);
        // this.authenticateSpotify = this.authenticateSpotify.bind(this); 
        // this.getCurrentSong = this.getCurrentSong.bind(this);
        // // this.getUserToken = this.getUserToken.bind(this); 
        // this.getRoomDetails();
    }

    getRoomDetails() { 
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
                if (this.state.isHost) { 
                    this.authenticateSpotify(); 
                } 
                
            });
    }
    
    // authenticateSpotify() { 
    //     fetch("/spotify/is-spotify-authenticated/")
    //         .then((response) => response.json())
    //         .then((data) => {
    //             this.setState({ spotifyAuthenticated: data.status, access_token: data.access_token });
    //             console.log(`STATE ACCESS TOKEN: ${this.state.access_token}`);
    //             if (!data.status) {
    //                 fetch('/spotify/get-auth-url/')
    //                     .then((response) => response.json())
    //                     .then((data) => {
    //                         window.location.replace(data.url);
    //                     });
    //             }
    //         }); 
    // }

    // componentDidMount() { 
    //     //Calls get current song every 1000 m.seconds (1 sec) while component is mounted
    //     this.interval = setInterval(this.getCurrentSong, 1000)
    // }
    // // Stop calls when unmounting 
    // componentWillUnmount() { 
    //     clearInterval(this.interval); 
    // }
    // getUserToken() {
    //     fetch("/spotify/user-token/")
    //         .then((response) => {
    //             return response.json();
    //         })
    //         .then(data => this.setState({access_token: data.access_token}));
    //         console.log(`USER TOKEN: ${this.state.access_token}`);
    // }
    // getCurrentSong() { 
    //     fetch("/spotify/current-song/")
    //         .then((response) => {
    //             if (response.status == 204) {
    //                 return {}; //TODO: build placeholder for player for when nothing is returned
    //             } else {
    //                 return response.json();
    //             }
    //         })
    //         .then((data) => {
    //             this.setState({song: data }); 
    //             // console.log(data);  
    //             // if (this.state.song.skip_votes === this.state.song.votes_needed) { 
    //             //     this.skipSong(); 
    //             // }
    //         }); 
        
    // }
    // skipSong() { 
    //     const requestOptions = {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //     }; 
    //     fetch("/spotify/skip/", requestOptions)
    //     .then((response) => {
    //             if (response.status == 403) {
    //                 this.setState({ guest_permission: false }); 
    //             }
    //         });
    // }

    // handleLeaveRoom() {
    //     const requestOptions = {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //     }; 
    //     fetch("/api/leave-room/", requestOptions)
    //         .then((_response) => {
    //             this.props.leaveRoomCallback();
    //             this.props.history.push("/");
    //         }); 
    // }

    // updateShowSettings(value) { 
    //     this.setState({ showSettings: value }); 
    // }

    // renderSettingsButton() { 
    //     return (
    //         <Grid item xs={12} align="center">
    //             <Button variant="contained" color="primary" onClick={() => this.updateShowSettings(true)}>
    //                 Settings
    //             </Button>
    //         </Grid>
    //     ); 
    // }

    // renderSettings() { 
    //     return (
    //         <Grid container spacing={1}>
    //             <Grid item xs={12} align="center">
    //                 <CreateRoomPage update={true} votesToSkip={this.state.votesToSkip} guestCanPause={this.state.guestCanPause} roomCode={this.roomCode} updateCallback={this.getRoomDetails}/> 
    //             </Grid>
    //             <Grid item xs={12} align="center">
    //                 <Button variant="contained" color="secondary" onClick={() => this.updateShowSettings(false)}>Close</Button>
    //             </Grid>
    //         </Grid>
    //     ); 
    // }

    render() { 
        if (this.state.showSettings) { 
            return this.renderSettings(); 
        }
        return (
            <Grid container spacing={1}>
                <Room></Room>
            </Grid>
        )
    }

}

