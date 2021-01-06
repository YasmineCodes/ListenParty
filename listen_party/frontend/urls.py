from spotify.views import SkipSong
from spotify.util import skip_song
from django.urls import path
from .views import index

app_name = 'frontend'

urlpatterns = [
    path('', index, name='home'),
    path('join/', index),
    path('create/', index),
    path('room/<str:roomCode>', index),
    
]
