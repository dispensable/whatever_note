from .base_handler import BasicHandler
import os

from model import img_handler


class ImgHandler(BasicHandler):
    def post(self, *args, **kwargs):
        print(self.request.body)
        upload_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static')  # 文件的暂存路径
        file_metas = self.request.files['file']  # 提取表单中‘name’为‘file’的文件元数据
        for meta in file_metas:
            filename = meta['filename']
            file_type = meta['content_type']

            if file_type == 'image/jpeg' or file_type == 'image/png':
                filepath = os.path.join(upload_path, filename)
                with open(filepath, 'wb') as up:  # 有些文件需要已二进制的形式存储，实际中可以更改
                    up.write(meta['body'])

                creater_id = self.get_body_argument("creater_id")
                note = self.get_body_argument("note")
                img_header = self.get_body_argument("img_header")

                img_handler.create_img(filepath, creater_id, note, img_header)

        self.write('finished!')


