#!/usr/bin/env python3
# -*-coding:utf-8-*-

from .database_connection import OpenCollection, str2object_id
from .user_post import add_comment, delete_comment
from .user_data import get_userid_by_name
import time
from bson.dbref import DBRef
import re
from . import notifications_data, user_data
from handlers import websockets_handler
from .shared_function import get_activity_types
from .img_handler import add_comment_to_img, delete_comment_by_img_id


def create_comment(content: str, post_by: str, post_id: str, p_num: int, s_num: int, post_type: str = 'post'):
    create_date = time.time()
    with OpenCollection('comments') as comments_collection:
        post_by_name = user_data.get_user_by_id(post_by)['username']
        content = at_mention_replace(post_by, content, post_by_name)
        comment = {
            'content': content,
            'post_id': DBRef('post', str2object_id(post_id)),
            'up': 0,
            'down': 0,
            'hold': 0,
            'create_date': create_date,
            'post_by': DBRef('user', str2object_id(post_by)),
            'post_by_id': post_by,
            'post_by_name': post_by_name,
            'voted_ids': [],
            'p_num': p_num,
            's_num': s_num
        }

        comment_id = comments_collection.insert(comment)

        if post_type == 'post':
            # 将评论添加到post下的相关引用位置
            add_comment(post_id, comment_id._ObjectId__id.hex(), post_by)
        if post_type == 'img':
            add_comment_to_img(post_id, post_by, comment_id._ObjectId__id.hex())

        # 添加到timeline
        try:
            abstract = content[0: 50]
        except IndexError:
            abstract = content

        user_data.add_activity(post_by, get_activity_types()['create_comment'],
                               create_date, DBRef('comment', comment_id), abstract)

        return comments_collection.find_one({'_id': comment_id})


def get_comment(comment_id: str):
    with OpenCollection('comments') as comments_collection:
        return comments_collection.find_one({'_id': str2object_id(comment_id)})


def del_comment(post_id: str, comment_id: str, comment_type='post'):
    if comment_type == 'post':
        delete_comment(post_id, comment_id)
    if comment_type == 'img':
        delete_comment_by_img_id(post_id, comment_id)
    with OpenCollection('comments') as comments_collection:
        return comments_collection.remove({"_id": str2object_id(comment_id)})


def vote_comment(comment_id: str, point: int, voter_id: str):
    """ vote for comment .
        point: 1,  vote comment up
        point: -1,  vote comment down
        point: 0, vote comment good job(but not influent up or down, means hold the position
    """
    with OpenCollection('comments') as comments_collection:
        comment = comments_collection.find_one({'_id': str2object_id(comment_id)})
        if voter_id not in comment['voted_ids']:
            if point in (1, -1, 0):
                if point == 1:
                    attitude = 'up'
                    op_type = get_activity_types()['up']
                elif point == -1:
                    attitude = 'down'
                    op_type = get_activity_types()['down']
                elif point == 0:
                    attitude = 'hold'
                    op_type = get_activity_types()['hold']
                    point = 1
                comments_collection.update({'_id': str2object_id(comment_id)},
                                           {"$inc": {attitude: point},
                                            "$addToSet": {"voted_ids": voter_id}})

                user_data.add_activity(voter_id, op_type, time.time(), str2object_id(comment_id), op_type)


def get_comments_by_post_id(post_id: str):
    with OpenCollection('comments') as comments_collection:
        comments = comments_collection.find({'post_id': DBRef('post', str2object_id(post_id))})
        if comments:
            results = {}
            db_con = OpenCollection.database
            for index, comment in enumerate(comments):
                del comment['post_id']
                comment['comment_id'] = comment['_id']._ObjectId__id.hex()
                del comment['_id']
                comment['post_by_id'] = comment['post_by'].id._ObjectId__id.hex()
                comment['post_by'] = db_con.dereference(comment['post_by'])['username'] #TODO: 添加内容以构造个人资料链接

                results[index] = comment
            return results
        else:
            return None


def at_mention_replace(post_by: str, content: str, post_by_name: str) -> str:
    # 找出@之后的用户名
    regx = re.compile(r'@([A-Za-z0-9_]+)\s')
    mentioned = re.findall(regx, content)

    # 最多@五个人在一条评论中
    if len(mentioned) > 6:
        mentioned = mentioned[0: 4]

    # 构造消息对象
    notification = {
        'info_from': post_by,
        'info_from_name': post_by_name,
        'info_to': [],
        'type': 1,
        'content': content,
        'timer': 3000,
        'date': time.time(),
        'has_read': False,
    }

    # 替换为显影带链接的文本
    for mention in mentioned:
        userid = get_userid_by_name(mention)
        if (len(mention) > 15) or (userid is None):
            continue

        notification['info_to'].append(userid)

        # 替换连接
        repl = '<a href="/profile/{0}">{1}</a>'.format(userid, '@{0} '.format(mention))
        content = re.sub('@' + mention + ' ', repl, content)

    if notification['info_to'] is not None:
        # 添加@提醒到提醒中心
        notification_id = notifications_data.creat_notification(notification)

        # 推送到客户端
        notification['id'] = notification['_id']._ObjectId__id.hex()
        del notification['_id']
        websockets_handler.EchoWebSocket.push_message(notification, notification_id)

    # 返回
    return content


def get_comments_by_id(userid: str):
    with OpenCollection('comments') as comments_collection:
        all_comments = comments_collection.find({'post_by_id': userid})
        results = {}
        for index, comment in enumerate(all_comments):
            comment['post_id'] = comment['post_id'].id._ObjectId__id.hex()
            comment['comment_id'] = comment['_id']._ObjectId__id.hex()
            del comment['_id']
            comment['post_by_id'] = comment['post_by'].id._ObjectId__id.hex()
            comment['post_by'] = OpenCollection.database.dereference(comment['post_by'])['username']  # TODO: 添加内容以构造个人资料链接

            results[index] = comment
    return results