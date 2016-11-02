from handlers import *

import tornado.ioloop
import tornado.web


def make_app():
    return tornado.web.Application([
        tornado.web.url(r'/', index_handler.MainHandler),
        (r'/api/user_qualification', auth_handler.SingUpHandler),
        (r'/api/token', auth_handler.ApiAuthHandler),
        (r'/api/name|/api/email', auth_handler.NameEmailUniqueHandler),
        tornado.web.url(r'/api/confirm_token/(.*)', auth_handler.ConfirmTokenHandler, name="confirm_token"),
        tornado.web.url(r'/api/posts', post_handler.PostsHandler, name="postshandler"),
        (r'/api/posts/([abcdef0123456789]*)', post_handler.SinglePostHandler),
        (r'/api/posts/([abcdef0123456789]*)/comments', comments_handler.CommentsHandler),
        (r'/api/posts/([abcdef0123456789]*)/comments/([abcdef0123456789]*)', comments_handler.SingleCommentHandler),
        (r'/api/users/([abcdef0123456789]*)', user_data_handler.UserHandler),
        (r'/api/userid', user_data_handler.UserIdHandler),
        (r'/api/users/([abcdef0123456789]*)/posts', user_data_handler.UserPostsHandler),
        (r'/api/users/mentionlist', user_data_handler.MentionListHandler),
        (r'/api/websocket', websockets_handler.EchoWebSocket),
        (r'/api/notifications', notification_handler.NotifyHandler),
        (r'/api/notifications/([abcdef0123456789]*)', notification_handler.PersonalNotifications),
        (r'/api/users/([abcdef0123456789]*)/follow/([abcdef0123456789]*)', user_data_handler.FollowHandler),
        (r'/api/users/([abcdef0123456789]*)/follower/([abcdef0123456789]*)', user_data_handler.FollowerHandler),
        (r'/api/users/([abcdef0123456789]*)/follow', user_data_handler.FollowHandler),
        (r'/api/users/([abcdef0123456789]*)/follower', user_data_handler.FollowerHandler),
    ], login_url='http://localhost:4200/singin')


if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()