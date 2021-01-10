import React, { Component }from "react"; 


export default class SpotifyPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            access_token: '',
        }
    }

    render() {
        return (
            <div>
                <script src="https://sdk.scdn.co/spotify-player.js"></script>
                <script>{
                    window.onSpotifyWebPlaybackSDKReady = () => {
                    const token = "BQCi6F2h8KHCMX4skO7afUEkRQPfvoy6ydc63vcLd5GZnRBI1EHsB9Wc3S2C9ejvWkAx9vb2ah-ds87JZ4NIxQyXW-gjBSCi1B4HN6RzYvYUa3pSCiijg-4sJ-iJXnkPZ3IebAllQZSm6ZF0oJ2oquN1wZUrVrD-aI7h4m5mJI4VXeFGNf9WRDkPBg";
                    const player = new Spotify.Player({
                        name: "Web Playback SDK Quick Start Player",
                        getOAuthToken: (cb) => {
                            cb(token);
                        },
                    });

                    // Error handling
                    player.addListener("initialization_error", ({ message }) => {
                        console.error(message);
                    });
                    player.addListener("authentication_error", ({ message }) => {
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
                }}
                </script>
            </div>
        );
    }
}

// export default SpotifyPlayer; 

// const {
//     Script: WebPlaybackSdkScript,
//     deviceId,
//     connect: connectWebPlaybackSdk,
//     player, // https://developer.spotify.com/documentation/web-playback-sdk/reference/#api-spotify-player
//     isReady,
//   } = useSpotifyWebPlaybackSdk({
//     name: "My Spotify Player", // Device that shows up in the spotify devices list
//     getOAuthToken: () => Promise.resolve(sessionStorage.getItem("accessToken")), // Wherever you get your access token from
//     onPlayerStateChanged: (playerState) => {
//       console.log('player state changed:', playerState);
//     }
//   });

//   React.useEffect(
//     () => {
//       if (isReady) {
//         connect();
//       }
//     },
//     [isReady],
//   );

//   // value == ...
//   return (
//     <React.Suspense fallback={<div>Loading...</div>}>
//     <WebPlaybackSdkScript>
//       <div>Any children</div>
//     </WebPlaybackSdkScript>
//     </React.Suspense>
//   )