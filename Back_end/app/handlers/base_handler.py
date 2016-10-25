import json
import tornado.web

# user handle
from model import user_data


class BasicHandler(tornado.web.RequestHandler):
    """覆盖一些基本方法"""

    def get_current_user(self):
        """覆盖获取当前用户的方法,使用请求首部中的token实现用户验证"""
        token = self.request.headers["Access-token"]
        if user_data.verify_auth_token(SECRET_KEY, token):
            pay_load = user_data.verify_auth_token(SECRET_KEY, token)
            return pay_load['userid']
        else:
            return None

    def prepare(self):
        """自动处理json类型"""
        try:
            if self.request.headers["Content-Type"].startswith("application/json") and \
                    self.request.body != b'':
                self.json_args = json.loads(self.request.body.decode())
            else:
                self.json_args = None
        except KeyError:
            pass

    def set_default_headers(self):
        self.set_header('Access-Control-Allow-Origin', 'http://localhost:4200')
