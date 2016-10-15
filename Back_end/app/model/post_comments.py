#!/usr/bin/env python3
# -*-coding:utf-8-*-

from .database_connection import open_database, str2object_id
from .user_post import add_comment
import time
from bson.dbref import DBRef


def create_comment(content: str, poster: str, post_id: str, create_date=time.time()):
    with open_database('comments') as comments_collection:
        comment = {
            'content': content,
            'post_id': DBRef('post', str2object_id(post_id)),
            'up': 0,
            'down': 0,
            'hold': 0,
            'create_date': create_date,
            'post_by': DBRef('user', str2object_id(poster))
        }
        comment_id = comments_collection.insert(comment)

        # 将评论添加到post下的相关引用位置
        add_comment(post_id, comment_id, poster)

        return comments_collection.find_one({'_id': comment_id})


def get_comment(comment_id: str):
    with open_database('comments') as comments_collection:
        return comments_collection.find_one({'_id': str2object_id(comment_id)})


def del_comment(comment_id: str):
    with open_database('comments') as comments_collection:
        return comments_collection.remove({"_id": str2object_id(comment_id)})


def vote_comment(comment_id: str, point: int):
    """ vote for comment .
        point: 1,  vote comment up
        point: -1,  vote comment down
        point: 0, vote comment good job(but not influent up or down, means hold the position
    """
    with open_database('comments') as comments_collection:
        if point in (1, -1, 0):
            if point == 1:
                attitude = 'up'
            elif point == -1:
                attitude = 'down'
            elif point == 0:
                attitude = 'hold'
                point = 1

            comments_collection.update({'_id': str2object_id(comment_id)}, {"$inc": {attitude: point}})