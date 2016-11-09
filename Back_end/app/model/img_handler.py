from .database_connection import OpenCollection, str2object_id
from .user_data import get_username_by_id, add_activity
import time
from .shared_function import get_activity_types
from bson.dbref import DBRef


def create_img(path: str, creater_id: str, note: str, post_header: str):
    image = {
        'path': path,
        'creater_id': creater_id,
        'creater_name': get_username_by_id(creater_id),
        'note': note,
        'create_time': time.time(),
        'header': post_header,
        'who_comments': [],
        'comment_ids': []
    }
    with OpenCollection('img') as img:
        img_id = img.insert(image)
        if img_id:
            add_activity(creater_id, get_activity_types()['create_image'], time.time(), img_id, post_header)
        return img_id


def get_img_by_id(img_id: str):
    with OpenCollection('img') as img:
        img = img.find_one({'_id': str2object_id(img_id)})
        if img:
            img['img_id'] = img['_id']._ObjectId__id.hex()
            del img['_id']
            img['count_comments'] = len(img['who_comments'])
            del img['who_comments']
            del img['comment_ids']
            return img


def add_comment_to_img(img_id: str, user_id: str, comment_id: str):
    with OpenCollection('img') as img:
        img.update({'_id': str2object_id(img_id)},
                   {'$addToSet': {'who_comments': DBRef('user', str2object_id(user_id)),
                                  'comment_ids': DBRef('comment', str2object_id(comment_id))}})


def delete_comment_by_img_id(img_id: str, comment_id: str):
    with OpenCollection('img') as img:
        # 构造object id
        img_id = str2object_id(img_id)
        comment_id = str2object_id(comment_id)

        img.update({"_id": img_id}, {"$pull": {"comment_ids": DBRef('comments', comment_id)}})