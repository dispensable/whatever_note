# posts handle
from model import user_post

from .base_handler import BasicHandler
from .handler_const import *


class PostsHandler(BasicHandler):
    def get(self, *args, **kwargs):
        # TODO： 重构 讲数据逻辑放到数据模型中去
        page = int(self.get_argument('page'))
        max_per_page = int(self.get_argument('perpage'))
        if page >= 0 and max_per_page >= 0:
            posts = user_post.get_posts_collection((page - 1) * max_per_page, max_per_page)

            # 构造上一页,下一页链接
            # 如果posts存在的话
            if posts:
                # 如果不是第一页(第一页没有上一页)
                if page > 1:
                    pre_link = WEBSITE_ADDR + self.reverse_url('postshandler') \
                                                 + ("?page={0}&perpage={1}".format((page - 1), max_per_page))
                    posts['pre_page'] = pre_link
                else:
                    # 如果是第一页,链接为空
                    posts['pre_page'] = ''

                # 如果返回的长度>=每页要求的内容的数量+1个prepage参数的数量 视为有下一页
                print(len(posts))
                if len(posts) >= max_per_page + 1:
                    next_link = WEBSITE_ADDR + self.reverse_url('postshandler') \
                                + ("?page={0}&perpage={1}".format((page + 1), max_per_page))
                    posts['next_page'] = next_link
                else:
                    posts['next_page'] = ''

                self.write(posts)
            else:
                self.set_status(404, "Can not found your page.")
        else:
            self.set_status(400, 'Wrong argument, page and max_per_page must be positive.')

    def post(self, *args, **kwargs):
        post_json = self.json_args
        post = user_post.create_post(post_json['post_by'], post_json['post_head'], post_json['content'])

        if post:
            post['post_id'] = post['_id']._ObjectId__id.hex()

            # 删除不需要的数据
            del post['_id']
            del post['who_comments']
            del post['comment_ids']
            del post['post_by']

            # self.set_header('Location', self.reverse_url(SinglePostHandler) + post['post_id'])
            self.set_status(201, 'Create success!')
            self.write(post)
        else:
            self.set_status(500, 'Create failed.')


class SinglePostHandler(BasicHandler):
    def get(self, post_id):
        post = user_post.get_post(post_id)
        if post:
            self.write(post)
        else:
            self.set_status(404)

    def put(self, post_id):
        new = self.json_args
        user_post.edit_post(post_id, new['post_head'], new['content'])

