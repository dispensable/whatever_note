#!/usr/bin/env python
#  _*_coding:utf-8_*_

from pymongo import MongoClient
import time
import bson
import binascii


def get_db_connection():
    try:
        return MongoClient()
    except Exception as e:
        raise e


def get_collection(db_con):
    try:
        return db_con.whatever_note.post
    except Exception as e:
        raise e


def create_post(poster: str, content: str, who_comments: set, date=time.time()):

    connection = get_db_connection()
    post_collection = get_collection(connection)

    post = {'poster': poster,
            'content': content,
            'who_comments': set([]).union(who_comments),
            'date': date,
            'comment_ids': []
    }

    try:
        post_collection.insert(post)
    finally:
        connection.close()


def str2object_id(id: str):
    return bson.objectid.ObjectId(binascii.unhexlify(id))


def add_comment(post_id: str, comment_id: str):
    connection = get_db_connection()
    post_collection = get_collection(connection)
    # 构造object id
    post_id = str2object_id(post_id)
    comment_id = str2object_id(comment_id)

    try:
        post_collection.update({"_id": post_id}, {"$addToSet": {"comment_ids": comment_id}})
    finally:
        connection.close()


def get_post(post_id: str) -> dict:
    connection = get_db_connection()
    post_collection = get_collection(connection)
    post_id = str2object_id(post_id)

    try:
        return post_collection.find_one({"_id": post_id}, {'_id': 0})
    finally:
        connection.close()


def edit_post(post_id: str, new_version: str):
    # find post and modify
    connection = get_db_connection()
    post_collection = get_collection(connection)

    try:
        obj_post_id = str2object_id(post_id)
        post_collection.update({'_id': obj_post_id},
                               {"$set": {"content": new_version}, "$set": {"date": time.time()}},
                               multi=False)
    finally:
        connection.close()


def del_post(post_id: str):
    connection = get_db_connection()
    post_collection = get_collection(connection)

    try:
        obj_post_id = str2object_id(post_id)
        post_collection.remove({'_id': obj_post_id})
    finally:
        connection.close()
