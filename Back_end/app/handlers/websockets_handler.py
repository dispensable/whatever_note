#!/usr/bin/env python3
# -*-coding:utf-8-*-

from tornado import websocket
import json
from model import notifications_data


class EchoWebSocket(websocket.WebSocketHandler):
    users = set()

    def open(self):
        EchoWebSocket.users.add(self)
        print("WebSocket opened")
        print(EchoWebSocket.users)

    def on_message(self, message):
        print(json.loads(message))

        notifications_data.creat_notification()

        for chater in EchoWebSocket.users:
            chater.write_message(message)

    def on_close(self):
        print("WebSocket closed")
        EchoWebSocket.users.remove(self)

    def check_origin(self, origin):
        return True
