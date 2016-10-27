#!/usr/bin/env python3
# -*-coding:utf-8-*-

from tornado import websocket
import json
from model import notifications_data, user_data
from .handler_const import *


class EchoWebSocket(websocket.WebSocketHandler):
    users = {}

    def open(self):
        print("WebSocket opened")
        print(EchoWebSocket.users)

    def on_message(self, message):
        message = json.loads(message)

        # 验证用户身份保存到登录用户集合
        token = message['token']
        user_info = user_data.verify_auth_token(SECRET_KEY, token)

        # 信息来源和token不符合的直接丢弃
        if user_info['userid'] != message['info_from']:
            return

        if user_info['userid'] not in EchoWebSocket.users:
            EchoWebSocket.users[user_info['userid']] = self

        # 消息通知持久化
        # TODO: 实现异步消息保存，加快处理速度
        try:
            notification_obj_id = notifications_data.creat_notification(message)
            message['id'] = notification_obj_id._ObjectId__id.hex()
        except Exception as e:
            raise e

        # 消息推送
        # TODO: 使用消息队列推送消息，加快处理速度
        for reciver in message['info_to']:
            # 保存消息id到用户notification集合
            user_data.add_notification(message['info_from'], notification_obj_id)
            # 在线直接推送
            if reciver in EchoWebSocket.users:
                EchoWebSocket.users[reciver].write_message(message)

    def on_close(self):
        print("WebSocket closed")
        EchoWebSocket.users.remove(self)

    def check_origin(self, origin):
        return True
