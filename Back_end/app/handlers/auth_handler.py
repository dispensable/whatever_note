import time
from .handler_const import *
from .base_handler import BasicHandler

# user handle
from celery_mq import tasks
from model import user_data


class SingUpHandler(BasicHandler):
    """ handler for /api/user_qualification """
    def post(self, *args, **kwargs):
        print("Get data from angular: {0}".format(self.request))
        print("Request body: {0}".format(self.request.body))
        singup = user_data.registe(self.request.body.decode(encoding='UTF-8'))
        if singup:
            # 发送确认邮件
            username = singup['username']
            email = singup['email']
            # 生成确认链接
            token = user_data.generate_auth_token(EMAIL_SECRET_KEY, int(time.time()) + 36000, username)
            active_link = WEBSITE_ADDR.join(self.reverse_url('confirm_token')).join(token.decode())
            print("ready to add tasks to celery.")
            # 添加到邮件发送队列
            tasks.auth_mail_task.delay(username, active_link, email)
            # 讲用户名和邮件地址发送到客户端
            self.write(singup)
        else:
            self.set_status(500, 'Sing up failed T_T')


class ApiAuthHandler(BasicHandler):
    """ handler for /api/token """
    def post(self, *args, **kwargs):
        login_data = self.json_args

        print("Request body: {0}".format(self.request.body))
        email = login_data['email']
        password = login_data['password']

        if user_data.verify_password(email, password):
            expiration = int(time.time() + 3600)
            username = user_data.get_username_by_email(email)
            userid = user_data.get_userid_by_email(email)
            token = user_data.generate_auth_token(SECRET_KEY, expiration, userid,
                                                  confirmed=user_data.has_confirmed(email))
            self.write({"expiration": expiration, "userid": userid, "username": username, "token": token.decode()})
        else:
            self.set_status(403, reason="login failed, please check your password or email.")


class NameEmailUniqueHandler(BasicHandler):
    """ 检查用户名唯一性 """
    def get(self):
        try:
            name = self.get_argument('name')
            email = None
        except Exception:
            email = self.get_argument('email')
            name = None

        if name is not None:
            self.write({'nameUnique': not user_data.is_name_exist(name), 'emailUnique': None})
        elif email is not None:
            self.write({'nameUnique': None, 'emailUnique': not user_data.is_email_exist(email)})
        else:
            self.set_status(403, 'Unknow argument.')
        print("Check name: {0}".format(name if name is not None else email))


class ConfirmTokenHandler(BasicHandler):
    """ 发送确认邮件 """
    def get(self, token):
        """ 从邮箱确认用户账户 """
        payload = user_data.verify_auth_token(EMAIL_SECRET_KEY, token)
        # 正常验证,可以确认
        if payload:
            user_data.confirm_user(payload['username'])
            self.write("<h1>Confirm successed!</h1> <h2>redirecting to sing in page ....</h2>")
            self.redirect(self.get_login_url())
        # 无法验证token
        else:
            self.write("Confirm failed.")
            self.set_status(403, "Can't confirm your link. The link is wrong or expired.")

    def post(self, *args, **kwargs):
        """ 重新发送确认邮件 """
        resend_info = self.json_args
        print(resend_info)
        if not user_data.has_confirmed(resend_info['email']):
            token = user_data.generate_auth_token(EMAIL_SECRET_KEY, int(time.time()) + 36000, resend_info['username'])
            active_link = WEBSITE_ADDR.join(self.reverse_url('confirm_token')).join(token.decode())
            user_data.auth_mail_task.delay(resend_info['username'], active_link, resend_info['email'])
            self.write('Your confirm email has been sent, check your inbox or trash box to confirm.')
        else:
            self.set_status(403, 'You account has been confirmed.')
            self.redirect(self.get_login_url())
