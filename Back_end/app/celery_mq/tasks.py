# -*-coding:utf-8 -*-
#!/usr/bin/env python3

from .celery import app


@app.task
def send_auth_mail():
    