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

    def on_message(self, message):
        message = json.loads(message)

        # 添加用户到连接列表
        self.auth_message(message)

        # 消息通知持久化
        for_send_msg = EchoWebSocket.add_message_to_db(message)

        # 消息推送
        EchoWebSocket.push_message(for_send_msg[0], for_send_msg[1])

    def on_close(self):
        del EchoWebSocket.users[self.user_id]

    def check_origin(self, origin):
        return True

    def auth_message(self, message):
        # 验证用户身份保存到登录用户集合
        token = message['token']
        user_info = user_data.verify_auth_token(SECRET_KEY, token)

        # 信息来源和token不符合的直接丢弃
        if user_info['userid'] != message['info_from']:
            return

        if user_info['userid'] not in EchoWebSocket.users:
            EchoWebSocket.users[user_info['userid']] = self
            self.user_id = user_info['userid']

    @classmethod
    def add_message_to_db(cls, message):
        # TODO: 实现异步消息保存，加快处理速度
        try:
            notification_obj_id = notifications_data.creat_notification(message)
            message['id'] = notification_obj_id._ObjectId__id.hex()
            del message['_id']
            return message, notification_obj_id
        except Exception as e:
            raise e

    @classmethod
    def push_message(cls, message, notification_obj_id):
        # TODO: 使用消息队列推送消息，加快处理速度
        for reciver in message['info_to']:
            # 保存消息id到用户notification集合
            user_data.add_notification(reciver, notification_obj_id)
            # 在线直接推送
            if reciver in EchoWebSocket.users:
                EchoWebSocket.users[reciver].write_message(message)