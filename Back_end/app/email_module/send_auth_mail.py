#!/usr/bin/env python3
# -*-coding:utf-8-*-

from .send_mail import send_email
from functools import partial
import os


def send_auth_mail(username, activelink, to_addr):
    plain_text = """
        Dear {0}:\n
        You recived this email because you have singed up WhateverNote(wwww.whatevernot.com).\n
        please paste this link to browser to active your account, so you can use our website.\n
        \n
        link: {1}
        thank you!\n
        WhateverNote team
    """.format(username, activelink)

    html_text = """
        <h1>Dear {0}:</h1>
        <p>You recieved this email because you have singed up WhateverNote(www.whatevernot-fake-url.com).</p>
        <p>please paste this link to browser to active your account, so you can use our website.</p>
        <br>
        <p>link: <a href="{1}">click me to active your account</a></p>
        <br>
        <p> if you can't click link, paste this link to browser and active your account:</p>
        <p> link: {2} </p>
        <br>
        <p>thank you!</p>
        <p>WhateverNote team</p>
    """.format(username, activelink, activelink)

    from_addr = os.environ.get('ADMINEMAIL')
    password = os.environ.get('PASSWORD')

    smtp_server = os.environ.get('SMTPSERVER')
    smtp_port = int(os.environ.get('SMTPPORT'))
    subject = 'Confirm Account'

    auth_mail_send = partial(send_email, plain_text=plain_text, html_text=html_text,
                             from_addr=from_addr, password=password, smtp_server=smtp_server,
                             smtp_port=smtp_port, subject=subject)
    auth_mail_send.__doc__ = 'send auth mail, partial from send mail for too many args.'

    return auth_mail_send(username=username, to_addr=to_addr)

if __name__ == '__main__':
    """ python的导入规则非常奇葩,需要单元测试时请讲上方的from .send_emai 改为from send_email
    在包内文件可以相对引用,但是直接运行该文件必须改为直接引用。
    是的,很奇葩不是么……

    请依次配置环境变量之后再运行此函数
    """
    send_auth_mail('test', 'www.try-to-registe-fake.com', 'example@test.com')
