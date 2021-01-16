import React, { Component } from 'react';

export default class SpotifyPlayer extends Component {
    constructor(props) { 
        super(props); 
        console.log("Spotify Player")
        this.state = { 
            accessToken: this.props.accessToken,
        }
        this.spotifySDK = this.spotifySDK.bind(this); 
        this.refreshToken = this.refreshToken.bind(this); 
        this.spotifySDK(); 
        
    }
    componentDidMount() { 
        this.spotifySDK(); 
    }

    spotifySDK(token=this.state.accessToken) {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);  
        window.onSpotifyWebPlaybackSDKReady = () => {
            console.log("On Listen Party Using Spotify Playback SDK - Ready")
            let player = new Spotify.Player({
                name: "Listen Party",
                getOAuthToken: (cb) => {
                    cb(token);
                },
            });
            // Error handling
            player.addListener("initialization_error", ({ message }) => {
                console.error(`Init error ${message}`);
            });
            player.addListener("authentication_error", ({ message }) => {
                this.refreshToken(); 
                console.error(message);
            });
            player.addListener("account_error", ({ message }) => {
                console.error(message);
            });
            player.addListener("playback_error", ({ message }) => {
                console.error(message);
            });

            // Playback status updates
            player.addListener("player_state_changed", (state) => {
                console.log(state);
            });

            // Ready
            player.addListener("ready", ({ device_id }) => {
                console.log("Ready with Device ID", device_id);
            });

            // Not Ready
            player.addListener("not_ready", ({ device_id }) => {
                console.log("Device ID has gone offline", device_id);
            });

            // Connect to the player!
            player.connect().then((success) => {
                if (success) {
                    console.log(
                    "The Web Playback SDK successfully connected to Spotify!"
                    );
                }
            });
        }
    }

    refreshToken(refreshNeeded) { 
        console.log('refresh needed'); 
        fetch("/spotify/refresh-token/")
            .then((response) => {
                if (!response.ok) {
                    console.log("Could not refresh token")
                }
                return response.json()
            }).then((data) => { 
                this.setState({ accessToken: data.access_token }); 
                this.props.callBack(data.access_token); 
                this.spotifySDK(); 
            }); 
    }
    render() {
        return <div></div>; 
    } 
   
}
