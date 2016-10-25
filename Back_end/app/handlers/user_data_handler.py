from model import user_data

# posts handle
from model import user_post

from .base_handler import BasicHandler


class UserHandler(BasicHandler):
    def get(self, user_id):
        user = user_data.get_user_by_id(user_id)

        if user:
            # Object 不能json序列化
            user['id'] = user['_id']._ObjectId__id.hex()
            del user['_id']
            del user['password']

            self.write(user)
        else:
            self.set_status(404, 'User do not exists.')


class UserPostsHandler(BasicHandler):
    def get(self, user_id):
        posts = user_post.get_posts_by_userid(user_id)
        if posts:

            self.write(posts)
        else:
            self.set_status(404, 'User or post not exists.')


class MentionListHandler(BasicHandler):
    def get(self, *args, **kwargs):
        post_id = self.get_argument('post_id')
        if post_id:
            self.write(user_post.get_mentionlist(post_id))
        else:
            self.set_status(404, 'argument error')


class UserIdHandler(BasicHandler):
    def get(self, *args, **kwargs):
        username = self.get_argument('username')
        userid = user_data.get_userid_by_name(username)
        if userid:
            self.write({'username': username, 'userid': userid})
        else:
            self.set_status(404, 'No such user.')

