#!/usr/bin/env python
#  _*_coding:utf-8_*_

from .database_connection import open_database, str2object_id, get_db_connection
import time
from bson.dbref import DBRef


def create_post(post_by_id: str, content: str, date=time.time()):

    with open_database('post') as post_collection:

        post = {'post_by': DBRef('user', str2object_id(post_by_id)),
                'content': content,
                'who_comments': set([]),
                'create_date': date,
                'last_modify': date,
                'comment_ids': []
        }

        post_id = post_collection.insert(post)
        return post_collection.find_one({"_id": post_id})


def add_comment(post_id: str, comment_id: str, user_id: str):
    with open_database('post') as post_collection:
        # 构造object id
        post_id = str2object_id(post_id)
        comment_id = str2object_id(comment_id)

        post_collection.update({"_id": post_id}, {"$addToSet": {"comment_ids": DBRef('comments', str2object_id(comment_id))},
                                                  "$addToSet": {"who_comments": DBRef('user', str2object_id(user_id))}})


def get_post(post_id: str) -> dict:
    """ 按照id获取单个文章 """
    with open_database('post') as post_collection:
        post_id = str2object_id(post_id)

        return post_collection.find_one({"_id": post_id})


def get_posts_collection(skip_pages: int, posts_per_page: int):
    result = {}
    with open_database('post') as post_collection:
        posts_gen = post_collection.find().skip(skip_pages).limit(posts_per_page)
        if posts_gen:
            try:
                db_connection = get_db_connection().get_database('whatever')
                for index, post in enumerate(posts_gen):
                    post['post_by'] = db_connection.dereference(post['post_by'])['username']
                    post['post_id'] = post['_id']._ObjectId__id.hex()
                    post['comments_count'] = len(post['comment_ids'])

                    result[index] = {
                        'post_by_name': post['post_by'],
                        'create_date': post['create_date'],
                        'last_modify': post['last_modify'],
                        'post_id': post['post_id'],
                        'comments_count': post['comments_count']
                    }
            finally:
                db_connection.close()
    return result



def edit_post(post_id: str, new_version: str):
    with open_database('post') as post_collection:
        obj_post_id = str2object_id(post_id)
        post_collection.update({'_id': obj_post_id},
                               {"$set": {"content": new_version}, "$set": {"last_modify": time.time()}},
                               multi=False)


def del_post(post_id: str):
    with open_database('post') as post_collection:
        obj_post_id = str2object_id(post_id)
        post_collection.remove({'_id': obj_post_id})


if __name__ == '__main__':
    pass