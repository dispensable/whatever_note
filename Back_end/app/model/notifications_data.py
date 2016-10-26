#!/usr/bin/env python
# -*-coding:utf-8-*-

from .database_connection import open_database, str2object_id


class Notification(object):
    def __init__(self, info_from: str, type: int, content: str, timer: int, date: float):
        self.info_from = info_from
        self.type = type
        self.content = content
        self.timer = timer
        self.date = date

    def __str__(self):
        return "{0} @ {1} say: {2} ".format(self.info_from, self.date, self.content)


def creat_notification(notification_list: list) -> None:
    with open_database('notification') as notify_collection:
        for notification in notification_list:

            notification = {
                'info_from': notification.info_from,
                'info_to': notification.info_to,
                'type': notification.type,
                'content': notification.content,
                'timer': notification.timer,
                'date': notification.date,
                'has_read': notification.has_read
            }

            notify_collection.insert(notification)


def get_notifications(userid: str):
    """ 获取所有通知 """
    with open_database('notification') as notification_collection:
        all_notifications = notification_collection.find({'info_to': userid})
        if all_notifications:
            results = {}
            for index, notification in enumerate(all_notifications):
                notification['id'] = notification['_id']._ObjectId__id.hex()
                results[index] = notification
            return results


def get_unread_info(userid: str):
    """ 获取所有未读通知 """
    with open_database('notification') as notification_collection:
        all_notifications = notification_collection.find({'info_to': userid, 'has_read': False})
        if all_notifications:
            results = {}
            for index, notification in enumerate(all_notifications):
                notification['id'] = notification['_id']._ObjectId__id.hex()
                results[index] = notification
            return results


def set_notifications_read(infos_id: list):
    with open_database('notification') as notification_collection:
        for info_id in infos_id:
            notification_collection.update({'_id': str2object_id(info_id)}, {'$set': {'has_read': True}})