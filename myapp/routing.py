from django.urls import path
from myapp.consumers import DinoConsumer  # Create this file

websocket_urlpatterns = [
    path("ws/dino/", DinoConsumer.as_asgi()),
]
