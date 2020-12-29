from django.shortcuts import render
from rest_framework import generics
from .serializers import RoomSerializer
from .models import Room


class Roomview(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
