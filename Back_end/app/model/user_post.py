#!/usr/bin/env python
#  _*_coding:utf-8_*_

from .database_connection import OpenCollection, str2object_id
import time
from bson.dbref import DBRef
from . import user_data
from .shared_function import get_activity_types


def create_post(post_by_id: str, post_head: str, content: str):
    with OpenCollection('post') as post_collection:
        date = time.time()
        post = {'post_head': post_head,
                'post_by': DBRef('user', str2object_id(post_by_id)),
                'content': content,
                'who_comments': [],
                'create_date': date,
                'last_modify': date,
                'comment_ids': []
        }

        post_id = post_collection.insert(post)
        if post_id:
            user_data.add_activity(post_by_id, get_activity_types()['create_post'], date, post_id, post_head)
        return post_collection.find_one({"_id": post_id})


def add_comment(post_id: str, comment_id: str, user_id: str):
    with OpenCollection('post') as post_collection:
        # 构造object id
        post_id = str2object_id(post_id)
        comment_id = str2object_id(comment_id)
        user_id = str2object_id(user_id)

        post_collection.update({"_id": post_id}, {"$addToSet": {"comment_ids": DBRef('comments', comment_id),
                                                  "who_comments": DBRef('user', user_id)}})


def delete_comment(post_id: str, comment_id: str):
    with OpenCollection('post') as post_collection:
        # 构造object id
        post_id = str2object_id(post_id)
        comment_id = str2object_id(comment_id)

        post_collection.update({"_id": post_id}, {"$pull": {"comment_ids": DBRef('comments', comment_id)}})


def get_post(post_id: str) -> dict:
    """ 按照id获取单个文章 """
    with OpenCollection('post') as post_collection:
        post_id = str2object_id(post_id)

        post = post_collection.find_one({"_id": post_id})
    if post:
        # comments_count: number,
        post['comments_count'] = len(post['comment_ids'])
        # content: string, 元数据中存在
        # create_date: number,存在
        # last_modify: number,存在
        # post_id: string,存在
        post['post_id'] = post['_id']._ObjectId__id.hex()
        # post_by_name: string,
        post['post_by_name'] = user_data.get_user_by_dbref(post['post_by'])['username']
        # post_by_id: string,
        # 修改DBref为字符串
        post['post_by_id'] = post['post_by'].id._ObjectId__id.hex()
        # post_head: string
        # participants_num: number
        post['participants_num'] = len(post['who_comments'])

        # 去除冗余数据
        del post['_id']
        del post['who_comments']
        del post['comment_ids']
        del post['post_by']

        return post


def get_posts_collection(skip_pages: int, posts_per_page: int):
    result = {}
    with OpenCollection('post') as post_collection:
        posts_gen = post_collection.find().skip(skip_pages).limit(posts_per_page)
        if posts_gen:
            db_connection = OpenCollection.database
            for index, post in enumerate(posts_gen):
                # 获取数据
                if not isinstance(post, dict):
                    post_item = post.next()  # generator here
                else:
                    post_item = post

                try:
                    post_head = post_item['post_head']
                except KeyError:
                    post_head = ''
                # 构造完整结果
                result[index] = {
                    'post_by_id': post_item['post_by'].id._ObjectId__id.hex(), # 根据DBref获得用户id的字符串
                    'post_by_name': db_connection.dereference(post_item['post_by'])['username'],
                    'create_date': post_item['create_date'],
                    'last_modify': post_item['last_modify'],
                    'post_id': post_item['_id']._ObjectId__id.hex(),  # 根据object id获得文章id的字符串
                    'comments_count': len(post_item['comment_ids']),
                    'content': post_item['content'],
                    'post_head': post_head
                }
    return result


def edit_post(post_id: str, new_head: str, new_version: str):
    with OpenCollection('post') as post_collection:
        obj_post_id = str2object_id(post_id)
        post_collection.update({'_id': obj_post_id},
                               {"$set": {"content": new_version, "post_head": new_head, "last_modify": time.time()}},
                               multi=False)
        print(post_collection.find_one({'_id': obj_post_id}))


def del_post(post_id: str):
    with OpenCollection('post') as post_collection:
        obj_post_id = str2object_id(post_id)
        post_collection.remove({'_id': obj_post_id})


def get_posts_by_userid(user_id):
    """ 全面用户posts api， 含posts的所有信息"""
    with OpenCollection('post') as post_collection:
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


def get_posts_list_by_userid(user_id):
    """ 轻量用户posts api，没有posts的内容，仅提供标题等信息 """
    with OpenCollection('post') as post_collection:
        posts = post_collection.find({'post_by': DBRef('user', str2object_id(user_id))},
                                     {'who_comments': False, 'post_by': False, 'content': False})
        results = {}
        for index, post in enumerate(posts):
            post['post_id'] = post['_id']._ObjectId__id.hex()
            del post['_id']
            post['comments_count'] = len(post['comment_ids'])
            del post['comment_ids']
            results[index] = post

    return results


def get_mentionlist(post_id):
    with OpenCollection('post') as post_collection:
        who_comments = post_collection.find_one({'_id': str2object_id(post_id)}, {'who_comments': True})['who_comments']
        db_con = OpenCollection.database
        mentionlist = []
        for user_dbref in who_comments:
            mentionlist.append(db_con.dereference(user_dbref)['username'])
    return {'who_comments': mentionlist}

if __name__ == '__main__':
    pass