from django.urls import path
from .views import *

urlpatterns = [
    path('get-auth-url/', AuthURL.as_view()),
    path('redirect/', spotify_callback),
    path('is-spotify-authenticated/', IsSpotifyAuthenticated.as_view()),
    path('current-song/', CurrentSong.as_view()),
    path('pause/', PauseSong.as_view()),
    path('play/', PlaySong.as_view()),
    path('skip/', SkipSong.as_view()),
]
