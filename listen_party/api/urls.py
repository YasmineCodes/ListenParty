from django.urls import path
from .views import CreateRoomView, Roomview, GetRoom

urlpatterns = [
    path('room/', Roomview.as_view()),
    path('create-room/', CreateRoomView.as_view()),
    path('get-room', GetRoom.as_view())
]
