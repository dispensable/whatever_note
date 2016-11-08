from .database_connection import OpenCollection, str2object_id
from .user_data import del_notification_by_id, get_username_by_id
import time


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
        return img.find_one({'_id': img_id})
