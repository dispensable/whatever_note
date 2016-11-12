# comments handle
from model import post_comments

from .base_handler import BasicHandler


class PostCommentsHandler(BasicHandler):
    def get(self, post_id):
        comments = post_comments.get_comments_by_post_id(post_id)
        if comments:
            self.write(comments)
        else:
            self.set_status(404, "comments not found, may be there is no comments or network broken.")

    def post(self, post_id):
        comment = self.json_args
        post_comments.create_comment(comment['content'], comment['post_by'],
                                     post_id, comment['p_num'], comment['s_num'], post_type=comment['post_type'])


class SingleCommentHandler(BasicHandler):
    def get(self, post_id, comments_id):
        pass

    def put(self, post_id, comments_id):
        point = self.json_args
        post_comments.vote_comment(comments_id, int(point['point']), self.get_current_user())
        self.set_status(200, 'successed!')

    def delete(self, comment_type, post_id, comments_id):
        try:
            post_comments.del_comment(post_id, comments_id, comment_type)
            self.set_status(204, 'DELETE successed')
        except Exception as e:
            print("Error happened when delete comment")
            print(e)
            self.set_status(500, 'delete comment error.')


class CommentsHandler(BasicHandler):
    def get(self, userid):
        self.write(post_comments.get_comments_by_id(userid))
