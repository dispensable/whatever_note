# _*_coding:utf-8_*_
#!/usr/bin/env python

from pymongo import MongoClient
import json
import jwt
import bcrypt


# 建立数据库连接
connection = MongoClient()
# 取得数据库
db = connection.whatever_note
# 取得用户集合
user = db.user


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


def generate_auth_token(secret_key, expiration, username, confirmed=True):
    if confirmed:
        return jwt.encode({'exp': expiration, 'username': username}, secret_key)
    else:
        return jwt.encode({'exp': expiration, 'username': username, 'confirmed': confirmed}, secret_key)


def verify_auth_token(secret_key, token):
    try:
        pay_load = jwt.decode(token, secret_key, algorithms=['HS256'])
        return pay_load
    except jwt.DecodeError:
        return None


def verify_password(email, password):
    user_data = user.find_one({'email': email})
    if user_data and password:
        hashed = user_data['password']
        return check_password(password.encode(), hashed)


def get_username_by_email(email):
    return user.find_one({'email': email}, {'username': 1})['username']


def is_name_exist(name):
    return True if user.find_one({'username': name}) else False


def is_email_exist(email):
    return True if user.find_one({'email': email}) else False


def confirm_user(username: str):
    if not user.find_one({'username': username})['confirmed']:
        user.update({'username': username}, {"$set": {"confirmed": True}, "$set": {"role": Role.user}}, multi=False)


def has_confirmed(email):
    return user.find_one({'email': email})['confirmed']

if __name__ == "__main__":
    pass
