import React, { Component } from 'react';

export default class SpotifyPlayer extends Component {
    constructor(props) { 
        super(props); 
        console.log("Spotify Player")
        this.state = { 
            player: {},
        }
        this.spotifySDK = this.spotifySDK.bind(this); 
        
    }
    componentDidMount() { 
        this.spotifySDK(); 
    }

    spotifySDK() {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);  
        window.onSpotifyWebPlaybackSDKReady = () => {
            console.log("On Listen Party Using Spotify Playback SDK - Ready")
            const token = this.props.token;
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
                player.connect(); 
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
        
    
    render() {
        return <div></div>; 
    } 
   
}
