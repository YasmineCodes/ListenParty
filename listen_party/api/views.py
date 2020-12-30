from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response


class Roomview(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code parameter not found'}, status=status.HTTP_400_BAD_REQUEST)


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        # Check if current user has active session
        if not self.request.session.exists(self.request.session.session_key):
            # Create session if not
            self.request.session.create()

        # Use serializer to get python representation of post data and check validity
        serializer = self.serializer_class(data=request.data)
        # if post data is not valid return 400
        if not serializer.is_valid():
            return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # create or update room using post data
            guest_can_pause = serializer.data.get("guest_can_pause")
            votes_to_skip = serializer.data.get("votes_to_skip")
            host = self.request.session.session_key  # get host from request.session
            # if room already exists/active update room settings
            room, created = Room.objects.update_or_create(
                host=host,
                defaults=dict(guest_can_pause=guest_can_pause,
                              votes_to_skip=votes_to_skip)
            )
            if created:
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
            else:
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
