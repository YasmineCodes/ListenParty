from django.urls import path
from .views import Roomview

urlpatterns = [
    path('room/', Roomview.as_view()),
]
