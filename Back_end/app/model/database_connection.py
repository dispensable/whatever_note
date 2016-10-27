from pymongo import MongoClient
import bson
import binascii


class OpenCollection(object):
    db_con = MongoClient(host='localhost', port=27017,
                         document_class=dict, tz_aware=False, connect=True)
    database = db_con.get_database('whatever_note')

    def __init__(self, collection_name):
        self.db_con = OpenCollection.db_con
        self.database = OpenCollection.database
        self.collection = self.database.get_collection(collection_name)

    def __enter__(self):
        return self.collection

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            print("database error, get connetion error or get collection error")
            raise exc_type


class open_db_con(object):
    def __init__(self, host='localhost', port=27017,
                 document_class=dict, tz_aware=False, connect=True, databasename='whatever_note'):
        self.mongo_con = MongoClient(host, port, document_class, tz_aware, connect)
        self.db_connection = self.mongo_con.get_database(databasename)

    def __enter__(self):
        return self.db_connection

    def __exit__(self, exc_type, exc_val, exc_tb):
        try:
            if exc_type is not None:
                print("database error, get connetion error")
                raise exc_type
        finally:
            self.mongo_con.close()


def str2object_id(id: str):
    """ 将给定字符串转为object——id对象 """
    return bson.objectid.ObjectId(binascii.unhexlify(id))


def get_db_connection(host='localhost', port=27017, document_class=dict, tz_aware=False, connect=True):
    try:
        return MongoClient(host, port, document_class, tz_aware, connect)
    except Exception as e:
        raise e


def get_collection(db_con, collection_name, databasename='whatever_note'):
    try:
        return db_con.get_database(databasename).get_collection(collection_name)
    except Exception as e:
        raise e


if __name__ == '__main__':
    con = get_db_connection()
    print(get_collection(con, 'user'))
    con.close()
