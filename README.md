# Listen Party

Jam, dance, learn, or laugh with friends. Use your Spotify premium account to listen to your favorite music and podcasts together. The app enables users to listen in sync. Guests can vote to skip, with hosts determining the number of votes required for a skip to take place. 

I built Listen Party using python and Django REST Framework for the backend API. I built the frontend logic and user interface, which consumes the Django API, using React.js and the Material-UI library. I leveraged Spotify's [Web API](https://developer.spotify.com/documentation/web-api/) to facilitate user authentication, to get playback data, and to affect playback-state changes. I used Spotify's Web [Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/) to enable content streaming through the browser. I deployed Listen Party using Python Anywhere.

## To Run Locally 
    python3 -m venv <path to virtual env>
    source <path to virtual env>/bin/activate
    python3 -m pip install -r requirements.txt 


Navigate to `listen_party` then run: 

    python3 manage.py runserver

For edits to React.js frontend navigate to `listen_party/frontend` then run: 

    npm install 
    npm run dev 

To update frontend: 

    npm run build 

To update Django static files from frontend: 

    python3 manage.py collectstatic

