#!/usr/bin/env python
#  _*_coding:utf-8_*_

import json
import jwt
import bcrypt
from .database_connection import OpenCollection, str2object_id
from bson.dbref import DBRef


class Permission(object):
    FOLLOW = 0x01
    COMMENT = 0x02
    WRITE_ARTICLES = 0x04
    MODERATE_COMMENTS = 0x08
    ADMINISTER = 0x80


class Role:
    unconfirmed_user = Permission.FOLLOW
    user = Permission.FOLLOW | Permission.COMMENT | Permission.WRITE_ARTICLES
    moderator = Permission.FOLLOW | Permission.COMMENT | Permission.WRITE_ARTICLES | Permission.MODERATE_COMMENTS
    administrator = 0xff


def generate_pwd_hash(password: bytes) -> bytes:
    """ generate password hash value : password must be encoded before hashing."""
    hashed = bcrypt.hashpw(password, bcrypt.gensalt())
    return hashed


def check_password(password: bytes, hashed: bytes) -> bool:
    """ password must be encoded before hashing. """
    return bcrypt.checkpw(password, hashed)


def registe(user_json):
    with OpenCollection('user') as user:
        # 将jason转化为字典
        user_data = json.loads(user_json)
        user_data['password'] = user_data['password'].encode()
        print("**** get data from angular ******")
        print(user_data)

        # 查找是否存在相同email的用户
        if user.find_one({'email': user_data['email']}) or user.find_one({'username': user_data['username']}):
            return None
        else:
            # 标记邮箱确认状态为未确认
            user_data['confirmed'] = False
            # 设置用户角色为默认角色
            user_data['role'] = Role.unconfirmed_user
            # 加密密码添加到数据库
            user_data['password'] = generate_pwd_hash(user_data['password'])
            # 保存用户信息
            try:
                print("user registe data is: {0}".format(user_data))
                user.insert(user_data)
                print("success!")
            except Exception as e:
                print("During save register data {0} happened!".format(e))

        # 查询以确认已成功保存 //TODO: 完善错误处理(数据保存失败的情况
        data = user.find_one({"email": user_data['email']}, {'_id': 0, 'confirmed': 0, 'password': 0})

        return data


def generate_auth_token(secret_key, expiration, userid, confirmed=True):
    if confirmed:
        return jwt.encode({'exp': expiration, 'userid': userid}, secret_key)
    else:
        return jwt.encode({'exp': expiration, 'confirmed': confirmed}, secret_key)


def verify_auth_token(secret_key, token):
    try:
        pay_load = jwt.decode(token, secret_key, algorithms=['HS256'])
        return pay_load
    except jwt.DecodeError:
        return None


def verify_password(email, password):
    with OpenCollection('user') as user:
        user_data = user.find_one({'email': email})
        if user_data and password:
            hashed = user_data['password']
            return check_password(password.encode(), hashed)


def get_username_by_email(email):
    with OpenCollection('user') as user:
        return user.find_one({'email': email}, {'username': 1})['username']


def is_name_exist(name):
    with OpenCollection('user') as user:
        return True if user.find_one({'username': name}) else False


def is_email_exist(email):
    with OpenCollection('user') as user:
        return True if user.find_one({'email': email}) else False


def confirm_user(username: str):
    with OpenCollection('user') as user:
        if not user.find_one({'username': username})['confirmed']:
            user.update({'username': username}, {"$set": {"confirmed": True, "role": Role.user}}, multi=False)


def has_confirmed(email):
    with OpenCollection('user') as user:
        return user.find_one({'email': email})['confirmed']


def get_user_by_id(user_id: str) -> dict:
    with OpenCollection('user') as user:
        return user.find_one({"_id": str2object_id(user_id)})


def get_userid_by_email(email: str) -> dict:
    with OpenCollection('user') as user:
        return user.find_one({'email': email})['_id']._ObjectId__id.hex()


def get_user_by_objid(objid):
    with OpenCollection('user') as user:
        return user.find_one({'_id': objid})


def get_user_by_dbref(dbref):
    db_con = OpenCollection.database
    return db_con.dereference(dbref)


def get_userid_by_name(username: str):
    with OpenCollection('user') as user:
        this_user = user.find_one({'username': username}, {'_id': True})
        if this_user is not None:
            return this_user['_id']._ObjectId__id.hex()


def get_notifications(userid: str) -> dict:
    with OpenCollection('user') as user:
        n_dbref = user.find_one({'_id': str2object_id(userid)}, {'notifications': True})

    results = {}

    for index, notify_dbref in enumerate(n_dbref['notifications']):
        notification = OpenCollection.database.dereference(notify_dbref)
        notification['id'] = notification['_id']._ObjectId__id.hex()
        del notification['_id']
        results[index] = notification
    return results


def add_notification(userid: str, notification_obj_id):
    with OpenCollection('user') as user:
        user.update({'_id': str2object_id(userid)},
                    {'$push': {'notifications':
                                   DBRef('notification', notification_obj_id)}})


def del_notification_by_id(userid: str, notification_id: str):
    with OpenCollection('user') as user:
        user.update({'_id': str2object_id(userid)},
                    {'$pull': {'notifications':
                                       DBRef('notification', str2object_id(notification_id))}})


def add_follow(userid: str, follow_id: str):
    with OpenCollection('user') as user:
        # 在userid下添加关注
        user.update({'_id': str2object_id(userid)},
                    {'$push': {'follow':
                               DBRef('user', str2object_id(follow_id))}})
        # 在follow_id下添加粉丝
        user.update({'_id': str2object_id(follow_id)},
                    {'$push': {'followers':
                               DBRef('user', str2object_id(userid))}})


def cancle_follow(userid: str, follow_id: str):
    with OpenCollection('user') as user:
        user.update({'_id': str2object_id(userid)},
                    {'$pull': {'follow':
                               DBRef('user', str2object_id(follow_id))}})


def del_followers(userid: str, follower_id: str):
    with OpenCollection('user') as user:
        user.update({'_id': str2object_id(userid)},
                    {'$pull': {'followers':
                                   DBRef('user', str2object_id(follower_id))}})
        user.update({'_id': str2object_id(follower_id)},
                    {'$pull': {'follow':
                                   DBRef('user', str2object_id(userid))}})


def check_followers(userid: str) -> dict:
    results = {}
    with OpenCollection('user') as user:
        followers = user.find_one({'_id': str2object_id(userid)})['followers']
        for dbref in followers:
            follower = OpenCollection.database.dereference(dbref)
            results[follower['_id']._ObjectId__id.hex()] = follower['username']
    return results


def check_follow(userid: str) -> dict:
    results = {}
    with OpenCollection('user') as user:
        followers = user.find_one({'_id': str2object_id(userid)})['follow']
        for dbref in followers:
            follower = OpenCollection.database.dereference(dbref)
            results[follower['_id']._ObjectId__id.hex()] = follower['username']
    return results


if __name__ == "__main__":
    pass
