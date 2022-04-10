import sqlite3


class DataBase:
    def __init__(self, database):
        """
        creates the database
        :param database: the name of the database
        """
        self.database = database
        self.connect()
        self.setup()

    def connect(self) -> None:
        """
        connects to the sqlite3 database, and create the cursor class
        :return: NIL
        """
        self.connection = sqlite3.connect(self.database, check_same_thread=False)
        self.cursor = self.connection.cursor()

    def close_connection(self) -> None:
        """
        closes the sqlite3 database connection
        :return: NIL
        """
        self.connection.close()

    def setup(self) -> None:
        """
        setups the database, checking if the table exists, if not creates it
        :return: NIL
        """
        with open('schema.sql') as f:
            self.connection.executescript(f.read())
        self.connection.commit()

    def insert_course(self, course_code: str, course_name: str, AU: float, course_index: str) -> None:
        sql_command = "INSERT INTO mods (course_code, course_name, AU, course_index) VALUES (?, ?, ?, ?);"
        data = (course_code, course_name, AU, course_index, )
        self.cursor.execute(sql_command, data)
        self.connection.commit()


if __name__ == '__main__':
    db = DataBase("mods.db")
    db.close_connection()
