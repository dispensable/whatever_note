from pymongo import MongoClient
import bson
import binascii


class open_database(object):
    def __init__(self, collection_name, host='localhost', port=27017,
                 document_class=dict, tz_aware=False, connect=True, databasename='whatever'):
        self.db_con = MongoClient(host, port, document_class, tz_aware, connect)
        self.collection = self.db_con.get_database(databasename).get_collection(collection_name)

    def __enter__(self):
        return self.collection

    def __exit__(self, exc_type, exc_val, exc_tb):
        try:
            if exc_type is not None:
                print("database error, get connetion error or get collection error")
                raise exc_type
        finally:
            self.db_con.close()


def str2object_id(id: str):
    """ 将给定字符串转为object——id对象 """
    return bson.objectid.ObjectId(binascii.unhexlify(id))


def get_db_connection(host='localhost', port=27017, document_class=dict, tz_aware=False, connect=True):
    try:
        return MongoClient(host, port, document_class, tz_aware, connect)
    except Exception as e:
        raise e


def get_collection(db_con, collection_name, databasename='whatevernote'):
    try:
        return db_con.get_database(databasename).get_collection(collection_name)
    except Exception as e:
        raise e


if __name__ == '__main__':
    con = get_db_connection()
    print(get_collection(con, 'user'))
    con.close()