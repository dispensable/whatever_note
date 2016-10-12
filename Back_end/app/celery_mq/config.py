# -*-coding:utf-8 -*-
#!/usr/bin/env python3

CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
BROKER_URL = 'redis://127.0.0.1:6379/1'

# 序列化方式
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'

#CELERY_ACCEPT_CONTENT=['json']
#CELERY_TIMEZONE = 'Europe/Oslo'
#CELERY_ENABLE_UTC = True

