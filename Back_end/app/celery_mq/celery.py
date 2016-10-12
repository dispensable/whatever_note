# -*- coding:utf-8 -*-
#!/usr/bin/env python3

from celery import Celery

app = Celery('celery_mq', include=['celery_mq.tasks'])

app.config_from_object('celery_mq.config')

if __name__ == '__main__':
    app.start()