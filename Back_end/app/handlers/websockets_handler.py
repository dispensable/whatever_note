#!/usr/bin/env python3
# -*-coding:utf-8-*-

from tornado import websocket
import json


class EchoWebSocket(websocket.WebSocketHandler):
    users = set()

    def open(self):
        EchoWebSocket.users.add(self)
        print("WebSocket opened")

    def on_message(self, message):
        print(json.loads(message))

        for chater in EchoWebSocket.users:
            chater.write_message(message)

    def on_close(self):
        print("WebSocket closed")
        EchoWebSocket.users.remove(self)

    def check_origin(self, origin):
        return True
