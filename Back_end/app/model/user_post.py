#!/usr/bin/env python
#  _*_coding:utf-8_*_

from .database_connection import open_database, str2object_id, open_db_con
import time
from bson.dbref import DBRef


def create_post(post_by_id: str, post_head: str, content: str, date=time.time()):
    with open_database('post') as post_collection:

        post = {'post_head': post_head,
                'post_by': DBRef('user', str2object_id(post_by_id)),
                'content': content,
                'who_comments': [],
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
        user_id = str2object_id(user_id)

        post_collection.update({"_id": post_id}, {"$addToSet": {"comment_ids": DBRef('comments', comment_id),
                                                  "who_comments": DBRef('user', user_id)}})


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
            with open_db_con() as db_connection:
                for index, post in enumerate(posts_gen):
                    # 获取数据
                    if not isinstance(post, dict):
                        post_item = post.next()  # generator here
                    else:
                        post_item = post

                    # 构造完整结果
                    result[index] = {
                        'post_by_id': post_item['post_by'].id._ObjectId__id.hex(), # 根据DBref获得用户id的字符串
                        'post_by_name': db_connection.dereference(post_item['post_by'])['username'],
                        'create_date': post_item['create_date'],
                        'last_modify': post_item['last_modify'],
                        'post_id': post_item['_id']._ObjectId__id.hex(), # 根据object id获得文章id的字符串
                        'comments_count': len(post_item['comment_ids']),
                        'content': post_item['content']
                    }
    return result


def edit_post(post_id: str, new_version: str):
    with open_database('post') as post_collection:
        obj_post_id = str2object_id(post_id)
        post_collection.update({'_id': obj_post_id},
                               {"$set": {"content": new_version, "last_modify": time.time()}},
                               multi=False)
        print(post_collection.find_one({'_id': obj_post_id}))


def del_post(post_id: str):
    with open_database('post') as post_collection:
        obj_post_id = str2object_id(post_id)
        post_collection.remove({'_id': obj_post_id})


def get_posts_by_userid(user_id):
    with open_database('post') as post_collection:
        posts = post_collection.find({'post_by': DBRef('user', str2object_id(user_id))},
                                     {'who_comments': False, 'post_by': False})
        results = {}
        for index, post in enumerate(posts):
            post['post_id'] = post['_id']._ObjectId__id.hex()
            del post['_id']
            post['comments_count'] = len(post['comment_ids'])
            del post['comment_ids']
            results[index] = post

    return results


if __name__ == '__main__':
    pass