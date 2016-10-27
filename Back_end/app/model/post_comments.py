#!/usr/bin/env python3
# -*-coding:utf-8-*-

from .database_connection import OpenCollection, str2object_id
from .user_post import add_comment, delete_comment
from .user_data import get_userid_by_name
import time
from bson.dbref import DBRef
import re


def create_comment(content: str, post_by: str, post_id: str, p_num: int, s_num: int):
    create_date = time.time()
    with OpenCollection('comments') as comments_collection:
        content = at_mention_replace(content)
        comment = {
            'content': content,
            'post_id': DBRef('post', str2object_id(post_id)),
            'up': 0,
            'down': 0,
            'hold': 0,
            'create_date': create_date,
            'post_by': DBRef('user', str2object_id(post_by)),
            'voted_ids': [],
            'p_num': p_num,
            's_num': s_num
        }

        comment_id = comments_collection.insert(comment)
        # 将评论添加到post下的相关引用位置
        add_comment(post_id, comment_id._ObjectId__id.hex(), post_by)

        return comments_collection.find_one({'_id': comment_id})


def get_comment(comment_id: str):
    with OpenCollection('comments') as comments_collection:
        return comments_collection.find_one({'_id': str2object_id(comment_id)})


def del_comment(post_id: str, comment_id: str):
    delete_comment(post_id, comment_id)
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
                elif point == -1:
                    attitude = 'down'
                elif point == 0:
                    attitude = 'hold'
                    point = 1
                comments_collection.update({'_id': str2object_id(comment_id)},
                                           {"$inc": {attitude: point},
                                            "$addToSet": {"voted_ids": voter_id}})


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


def at_mention_replace(content: str) -> str:
    # 找出@之后的用户名
    regx = re.compile(r'@([A-Za-z0-9_]+)\s')
    mentioned = re.findall(regx, content)

    # 最多@五个人在一条评论中
    if len(mentioned) > 6:
        mentioned = mentioned[0: 4]

    # 替换为显影带链接的文本
    for mention in mentioned:
        userid = get_userid_by_name(mention)
        if (len(mention) > 15) or (userid is None):
            continue
        repl = '<a href="/profile/{0}">{1}</a>'.format(userid, '@{0} '.format(mention))
        content = re.sub('@' + mention + ' ', repl, content)
    # 返回
    return content