from .database_connection import OpenCollection, str2object_id
from .user_data import get_username_by_id, add_activity
import time
from .shared_function import get_activity_types


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
        return img.find_one({'_id': img_id})


def get_img_by_id(img_id: str):
    with OpenCollection('img') as img:
        img = img.find_one({'img_id': str2object_id(img_id)})
        if img:
            img['img_id'] = img['_id']._ObjectId__id.hex()
            del img['_id']
            img['count_comments'] = len(img['who_comments'])
            del img['who_comments']
            del img['comment_ids']
            return img
