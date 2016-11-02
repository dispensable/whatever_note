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
            del user['notifications']

            user['follow'] = user_data.check_follow(user['id'])
            user['followers'] = user_data.check_followers(user['id'])

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


class FollowHandler(BasicHandler):
    def get(self, userid):
        return user_data.check_follow(userid)

    def post(self, userid, follow_id):
        try:
            user_data.add_follow(userid, follow_id)
            self.set_status(201, 'follow successed!')
        except Exception as e:
            raise e

    def delete(self, userid, follow_id):
        try:
            user_data.cancle_follow(userid, follow_id)
            self.set_status(200, 'delete successed!')
        except Exception as e:
            raise e


class FollowerHandler(BasicHandler):
    def get(self, userid):
        return user_data.check_followers(userid)

    def delete(self, userid, follower_id):
        user_data.del_followers(userid, follower_id)