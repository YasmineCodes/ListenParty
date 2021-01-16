from django.shortcuts import redirect
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from requests import Request, post
from .util import *
from api.models import Room
from .models import Vote
import json
import os


CURRENT_SONG = {}
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")


class AuthURL(APIView):
    def get(self, request, fornat=None):
        scopes = 'streaming app-remote-control user-read-email user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)


def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(
        request.session.session_key, access_token, token_type, expires_in, refresh_token)

    return redirect('frontend:home')


class RefreshToken(APIView):
    def get(self, request, format=None):
        session_key = self.request.session.session_key
        tokens = get_user_tokens(session_key)
        refresh = refresh_spotify_token(session_key, tokens)
        if refresh == 'error':
            return Response({}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'access_token': tokens.access_token}, status=status.HTTP_200_OK)


class IsSpotifyAuthenticated(APIView):
    def get(self, request, format=None):
        authentication = is_spotify_authenticated(
            request.session.session_key)
        is_authenticated = authentication.get('is_authenticated')
        access_token = authentication.get('access_token')
        return Response({'status': is_authenticated, 'access_token': access_token}, status=status.HTTP_200_OK)


class CurrentSong(APIView):
    def get(self, request, format=None):
        # get room code
        room_code = self.request.session.get('room_code')
        # Since session may not be the session of the host, we get the room using the room code
        queryset = Room.objects.filter(code=room_code)
        if queryset.exists():
            room = queryset[0]
        else:
            return Response({'Error': 'Not currently in a room'}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        endpoint = 'player'
        response = execute_spotify_api_request(host, endpoint)
        if 'error' in response or 'item' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')

        # get artist info, including if multiple artists
        artist_string = ''
        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ', '
            name = artist.get('name')
            artist_string += name
        votes = len(Vote.objects.filter(room=room, song_id=song_id))
        # aggregate info into song_object
        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'uri': item.get('uri'),
            'duration': duration,
            'progress': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'skip_votes': votes,
            'votes_needed': room.votes_to_skip,
            'id': song_id
        }
        self.update_room_song(room, song_id)

        # update current_song variable
        CURRENT_SONG['uri'] = song.get('uri')
        CURRENT_SONG['progress'] = song.get('progress')
        if self.request.session.session_key != host:
            payload = {'uris': [CURRENT_SONG.get('uri')],
                       'position_ms': CURRENT_SONG.get('progress')}
            sync_response = sync_guest_player(
                self.request.session.session_key, payload)
            print(sync_response)

        # Make sure listen party player is active
        activate_listen_party_player(self.request.session.session_key)
        # return song object
        return Response(song, status=status.HTTP_200_OK)

    def update_room_song(self, room, song_id):
        current_song = room.current_song
        if current_song != song_id:
            room.current_song = song_id
            room.save(update_fields=['current_song'])
            votes = Vote.objects.filter(room=room).delete()


class SyncGuest(APIView):
    def put(self, request, format=None):
        session_key = self.request.session.session_key
        room_code = self.request.session.get('room_code')
        queryset = Room.objects.filter(code=room_code)
        if queryset.exists():
            room = queryset[0]
        else:
            return Response({'Error': 'Not currently in a room'}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        # If not host, sync player with host
        if session_key != host:
            payload = {'uris': [CURRENT_SONG.get('uri')],
                       'position_ms': CURRENT_SONG.get('progress')}
            response = sync_guest_player(
                session_key, data=json.dumps(payload))
            print(response)
            if response.status_code == 204:
                return Response(response, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(response, status=status.HTTP_400_BAD_REQUEST)


class PauseSong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            pause_song(room.host)
            payload = {'uris': [CURRENT_SONG.get('uri')],
                       'position_ms': CURRENT_SONG.get('progress')}
            sync_response = sync_guest_player(
                self.request.session.session_key, data=json.dumps(payload))
            print(f"PAUSE SYNC RESPONSE: {sync_response}")
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        return Response({}, status=status.HTTP_403_FORBIDDEN)


class PlaySong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            play_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        return Response({}, status=status.HTTP_403_FORBIDDEN)


class SkipSong(APIView):
    def post(self, request, format=None):
        if not request.session.exists(request.session.session_key):
            request.session.create()
        room_code = request.session.get('room_code')
        queryset = Room.objects.filter(code=room_code)

        if queryset.exists():
            room = queryset[0]
            votes = Vote.objects.filter(room=room, song_id=room.current_song)
            votes_needed = room.votes_to_skip
            if self.request.session.session_key == room.host or len(votes)+1 >= votes_needed:
                votes.delete()
                skip_song(room.host)
            else:
                vote = Vote(user=self.request.session.session_key,
                            room=room, song_id=room.current_song)
                vote.save()
        return Response({}, status=status.HTTP_204_NO_CONTENT)
