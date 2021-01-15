from requests.api import head
from requests.sessions import session
from rest_framework.response import Response
from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from requests import post, put, get
from rest_framework import status
import json
import os

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")
BASE_URL = "https://api.spotify.com/v1/me/"


def get_user_tokens(session_key):
    user_tokens = SpotifyToken.objects.filter(user=session_key)
    if user_tokens.exists():
        return user_tokens[0]
    print("NO TOKENS FOR THIS USER.")
    return None


def update_or_create_user_tokens(session_key, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_key)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        print("UPDATING TOKENS")
        tokens.save(update_fields=['access_token',
                                   'refresh_token', 'expires_in', 'token_type'])

    else:
        print("CREATING NEW TOKENS")
        tokens = SpotifyToken(user=session_key, access_token=access_token,
                              refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
        tokens.save()


def is_spotify_authenticated(session_key):
    tokens = get_user_tokens(session_key)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            print("TOKEN EXPIRED, REFRESHING...")
            refresh_response = refresh_spotify_token(session_key, tokens)
            if refresh_response == 'error':
                return {'is_authenticated': False, 'access_token': ''}
            else:
                print("TOKEN REFRESHED.")
        access_token = tokens.access_token
        return {'is_authenticated': True, 'access_token': access_token}
    return {'is_authenticated': False, 'access_token': ''}


def refresh_spotify_token(session_key, tokens):
    refresh_token = tokens.refresh_token
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }).json()
    if 'error' in response:
        return 'error'
    else:
        access_token = response.get('access_token')
        token_type = response.get('token_type')
        expires_in = response.get('expires_in')
        update_or_create_user_tokens(
            session_key, access_token, token_type, expires_in, refresh_token)


def execute_spotify_api_request(host, endpoint, post_=False, put_=False, data={}):
    tokens = get_user_tokens(host)
    headers = {'Content-Type': 'application/json',
               'Authorization': 'Bearer ' + tokens.access_token}
    if post_:
        post(BASE_URL + endpoint, headers=headers, data=data)
    if put_:
        response = put(BASE_URL + endpoint, headers=headers, data=data)
        print("PUT REQUEST COMPLETED")
        return response

    response = get(BASE_URL + endpoint, {}, headers=headers)
    try:
        return response.json()
    except:
        return {'error': 'Proplem with request'}


def pause_song(host):
    return execute_spotify_api_request(host, "player/pause", put_=True)


def play_song(host):
    return execute_spotify_api_request(host, "player/play", put_=True)


def sync_guest_player(session_key, data):
    guest_currently_playing = execute_spotify_api_request(
        session_key, 'player')
    if 'error' in guest_currently_playing or 'item' not in guest_currently_playing:
        return Response({}, status=status.HTTP_204_NO_CONTENT)
    guest_song_uri = guest_currently_playing.get('item').get('uri')
    guest_song_progress = guest_currently_playing.get('progress_ms')
    host_song_uri = data.get('uris')
    host_song_progress = data.get('progress')
    print(host_song_uri[0], guest_song_uri)
    if (guest_song_uri != host_song_uri[0] or
        (guest_song_uri == host_song_uri and
         guest_song_progress not in range(host_song_progress-20000, host_song_progress+20000))):
        return execute_spotify_api_request(host=session_key, endpoint="player/play", put_=True, data=json.dumps(data))
    return "No need to sync"


def skip_song(session_key):
    return execute_spotify_api_request(session_key, 'player/next', post_=True)


def activate_listen_party_player(session_key):
    devices_endpoint = 'player/devices'
    transfer_endpoint = 'player'
    # Get list of available devices for user
    response = execute_spotify_api_request(session_key, devices_endpoint)
    # Find Listen Party Player in returned list
    listen_party_player = [
        device for device in response.get('devices') if device.get('name') == "Listen Party"]
    # Transfer playback to list_party player if it is found and is not already active
    if listen_party_player and not listen_party_player[0].get('is_active'):
        print('ACTIVATING LISTEN PARTY PLAYER...')
        data = {'device_ids': [listen_party_player[0].get('id')]}
        response = execute_spotify_api_request(
            session_key, transfer_endpoint, put_=True, data=json.dumps(data))
        print(response)
    elif not listen_party_player:
        print(f"LISTEN PARTY PLAYER NOT FOUND")
