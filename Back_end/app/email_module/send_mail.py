#!/usr/bin/env python3
# -*-coding:utf-8-*-

from email.header import Header
from email.mime.text import MIMEText
from email.utils import parseaddr, formataddr
from email.mime.multipart import MIMEMultipart

import smtplib


def send_email(from_addr, password, to_addr, smtp_server,
               smtp_port, subject, username, plain_text,
               html_text):

    def _format_addr(s):
        name, addr = parseaddr(s)
        return formataddr((Header(name, 'utf-8').encode(), addr))

    # 构造消息内容
    msg = MIMEMultipart('alternative')

    msg['From'] = _format_addr('WhateverNote <%s>' % from_addr)
    msg['To'] = _format_addr((username + ' <%s>') % to_addr)
    msg['Subject'] = Header('[WhateverNote]' + subject, 'utf-8').encode()

    msg.attach(MIMEText(plain_text, 'plain', 'utf-8'))
    msg.attach(MIMEText(html_text, 'html', 'utf-8'))

    # 连接服务器发送邮件
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.set_debuglevel(1)
    server.login(from_addr, password)
    server.sendmail(from_addr, [to_addr], msg.as_string())
    server.quit()

if __name__ == '__main__':
    plain_text = """ this is a test for
    whatever note send mail."""
    html_text = "<h1>this is a test </h1>"
    from_addr = '************'
    password = '***********'
    to_addr = '***********'
    smtp_server = 'smtp-mail.outlook.com'
    smtp_port = 587
    subject = 'subject test'
    username = 'username'

    send_email(from_addr, password, to_addr, smtp_server, smtp_port, subject, username, plain_text, html_text)