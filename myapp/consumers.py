import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
import subprocess

class DinoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send("Connected to Dino Game Terminal!\n")

    async def receive(self, text_data):
        process = subprocess.Popen(
            text_data, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        stdout, stderr = process.communicate()
        await self.send(stdout.decode() if stdout else stderr.decode())

    async def disconnect(self, close_code):
        pass
