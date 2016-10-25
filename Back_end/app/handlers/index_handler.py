from .base_handler import BasicHandler


class MainHandler(BasicHandler):
    """ handler for / """
    def get(self, *args, **kwargs):
        if self.current_user:
            self.write('Hello' + self.current_user)
        else:
            self.write('<h1>Hello Stranger!</h1>')