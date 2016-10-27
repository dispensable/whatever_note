# notification handle
from model import notifications_data as info_data
from model import user_data

from .base_handler import BasicHandler


class NotifyHandler(BasicHandler):
    """ EXAMPLE: http get localhost:8888/api/notifications?userid=xxxxx&unread=1/0"""
    def get(self):
        userid = self.get_argument('userid')
        unread = self.get_argument('unread')

        if self.get_current_user()['userid'] != userid:
            self.set_status(403, 'Unauth!')
        elif not unread:
            all_notifications = info_data.get_notifications(userid)
            if all_notifications:
                self.write(all_notifications)
            else:
                self.set_status(404, 'There is no notifications')
        elif unread:
            unread_info = info_data.get_unread_info(userid)
            if unread_info:
                self.write(unread_info)
            else:
                self.set_status(404, 'Not found unread message.')

    def post(self):
        notification = self.json_args['notification']
        try:
            info_id = info_data.create_notification(notification)
            user_data.add_notification(info_id)
            self.set_status(201, 'Create success!')
        except Exception as e:
            print(e)
            self.set_status(500, 'create failed!')

    def put(self):
        """
        http PUT localhost:8888/api/notifications?userid=xxxx&notification_id=xxxxx
        :return:
        """
        userid = self.get_argument('userid')
        notification_id = self.get_argument('notification_id')
        try:
            info_data.set_notification_read(userid, notification_id)
        except Exception as e:
            self.set_status(500, '修改未读状态错误')
            raise e


class PersonalNotifications(BasicHandler):
    """ http get http://localhost:8888/api/notifications/<userid>"""
    def get(self, userid):
        notifydict = user_data.get_notifications(userid)
        print(notifydict)
        if notifydict:
            self.write(notifydict)
        else:
            self.set_status(404, 'no notifications')