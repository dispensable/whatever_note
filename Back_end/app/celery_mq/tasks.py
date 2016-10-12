#!/usr/bin/env python3
# -*-coding:utf-8 -*-

from .celery import app
from email_module.send_auth_mail import send_auth_mail

@app.task
def auth_mail_task(username, activelink, to_addr):
    return send_auth_mail(username, activelink, to_addr)