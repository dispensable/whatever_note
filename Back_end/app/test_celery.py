from celery_mq.tasks import add

r = add.delay(4, 4)

while True:
    if r.ready():
        print(r.result)
        break