from handlers import *

import tornado.ioloop
import tornado.web

import os

settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "static"),
    # "cookie_secret": "__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
    # "login_url": "/login",
    # "xsrf_cookies": True,
}


def make_app():
    return tornado.web.Application([
        tornado.web.url(r'/', index_handler.MainHandler),
        (r'/api/user_qualification', auth_handler.SingUpHandler),
        (r'/api/token', auth_handler.ApiAuthHandler),
        (r'/api/name|/api/email', auth_handler.NameEmailUniqueHandler),
        tornado.web.url(r'/api/confirm_token/(.*)', auth_handler.ConfirmTokenHandler, name="confirm_token"),
        tornado.web.url(r'/api/posts', post_handler.PostsHandler, name="postshandler"),
        (r'/api/posts/([abcdef0123456789]*)', post_handler.SinglePostHandler),
        (r'/api/posts/([abcdef0123456789]*)/comments', comments_handler.PostCommentsHandler),
        (r'/api/(post)s/([abcdef0123456789]*)/comments/([abcdef0123456789]*)', comments_handler.SingleCommentHandler),
        (r'/api/(img)/([abcdef0123456789]*)/comments/([abcdef0123456789]*)', comments_handler.SingleCommentHandler),
        (r'/api/users/([abcdef0123456789]*)', user_data_handler.UserHandler),
        (r'/api/userid', user_data_handler.UserIdHandler),
        (r'/api/users/([abcdef0123456789]*)/posts', user_data_handler.UserPostsHandler),
        (r'/api/users/([abcdef0123456789]*)/postslist', user_data_handler.UserPostsListHandler),
        (r'/api/users/([abcdef0123456789]*)/comments', comments_handler.CommentsHandler),
        (r'/api/users/mentionlist', user_data_handler.MentionListHandler),
        (r'/api/websocket', websockets_handler.EchoWebSocket),
        (r'/api/notifications', notification_handler.NotifyHandler),
        (r'/api/users/([abcdef0123456789]*)/notifications', notification_handler.PersonalNotifications),
        (r'/api/users/([abcdef0123456789]*)/follow/([abcdef0123456789]*)', user_data_handler.FollowHandler),
        (r'/api/users/([abcdef0123456789]*)/follower/([abcdef0123456789]*)', user_data_handler.FollowerHandler),
        (r'/api/users/([abcdef0123456789]*)/follow', user_data_handler.FollowHandler),
        (r'/api/users/([abcdef0123456789]*)/follower', user_data_handler.FollowerHandler),
        (r"/static/(.*\.jpg)", tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
        (r'/api/img', file_handler.ImgHandler),
    ], login_url='http://localhost:4200/singin')


if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()