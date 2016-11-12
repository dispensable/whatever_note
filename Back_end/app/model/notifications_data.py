#!/usr/bin/env python
# -*-coding:utf-8-*-

from .database_connection import OpenCollection, str2object_id
from .user_data import del_notification_by_id, del_notifications_by_ids


class Notification(object):
    def __init__(self, info_from: str, type: int, content: str, timer: int, date: float):
        self.info_from = info_from
        self.type = type
        self.content = content
        self.timer = timer
        self.date = date

    def __str__(self):
        return "{0} @ {1} say: {2} ".format(self.info_from, self.date, self.content)


def creat_notification(notification: dict):
    """
    :param notification:
             notification = {
            'info_from': notification.info_from,
            'info_to': notification.info_to,
            'type': notification.type,
            'content': notification.content,
            'timer': notification.timer,
            'date': notification.date,
            'has_read': notification.has_read
        }
    :return: 保存到数据库
    """
    with OpenCollection('notification') as notify_collection:
        return notify_collection.insert(notification)


def get_notifications(userid: str):
    """ 获取所有通知 """
    with OpenCollection('notification') as notification_collection:
        all_notifications = notification_collection.find({'info_to': userid})
        if all_notifications:
            results = {}
            for index, notification in enumerate(all_notifications):
                notification['id'] = notification['_id']._ObjectId__id.hex()
                results[index] = notification
            return results


def get_unread_info(userid: str):
    """ 获取所有未读通知 """
    with OpenCollection('notification') as notification_collection:
        all_notifications = notification_collection.find({'info_to': userid, 'has_read': False})
        if all_notifications:
            results = {}
            for index, notification in enumerate(all_notifications):
                notification['id'] = notification['_id']._ObjectId__id.hex()
                del notification['_id']
                results[index] = notification
            return results


def set_notification_read(userid: str, notification_id: str):
    with OpenCollection('notification') as notification_collection:
        notification_collection.update({'_id': str2object_id(notification_id)}, {'$set': {'has_read': True}})
    del_notification_by_id(userid, notification_id)


def set_all_notifications_read(userid: str, to_set: list):
    with OpenCollection('notification') as notification_collection:
        for notification_id in to_set:
            notification_collection.update({'_id': str2object_id(notification_id)}, {'$set': {'has_read': True}})
    del_notifications_by_ids(userid, to_set)