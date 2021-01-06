from requests.api import head
from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get

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
            refresh_spotify_token(session_key)
            print("TOKEN REFRESHED.")
        return True
    return False


def refresh_spotify_token(session_key):
    refresh_token = get_user_tokens(session_key).refresh_token
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    # refresh_token = response.get('refresh_token')

    update_or_create_user_tokens(
        session_key, access_token, token_type, expires_in, refresh_token)


def execute_spotify_api_request(host, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(host)
    headers = {'Content-Type': 'application/json',
               'Authorization': 'Bearer ' + tokens.access_token}
    if post_:
        post(BASE_URL + endpoint, headers=headers)
    if put_:
        put(BASE_URL + endpoint, headers=headers)

    response = get(BASE_URL + endpoint, {}, headers=headers)
    try:
        return response.json()
    except:
        return {'error': 'Proplem with request'}


def pause_song(host):
    return execute_spotify_api_request(host, "player/pause", put_=True)


def play_song(host):
    return execute_spotify_api_request(host, "player/play", put_=True)


def skip_song(session_key):
    return execute_spotify_api_request(session_key, 'player/next', post_=True)


def activate_spotify_device(host, device):
    print('activating device')
    headers = {'Content-Type': 'application/json',
               'Authorization': 'Bearer ' + host.access_token,
               }
    response = put('https://api.spotify.com/v1/me/player', headers=headers, data={'device_ids': [device], 'play': True}
                   ).json()
    print(response)
