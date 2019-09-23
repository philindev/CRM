from sqlite3 import connect
from passlib.hash import pbkdf2_sha256
from string import ascii_letters, digits, punctuation
from random import choices
from time import time


class DB:
    def __init__(self, db_name):
        conn = connect(db_name + ".db", check_same_thread=False)
        self.name = db_name
        self.conn = conn

    def get_connection(self):
        return self.conn

    def get_name(self):
        return self.name

    def __del__(self):
        self.conn.close()


class AbstractTable:
    def __init__(self, connection):
        self.error = "-1"
        self.connection = connection

    def get_error(self):
        return self.error


class AdminsTable(AbstractTable):
    def __init__(self, connection):
        super().__init__(connection)

    def init_table(self):
        cursor = self.connection.cursor()
        cursor.execute(
            '''CREATE TABLE IF NOT EXISTS admins
            (id INTEGER PRIMARY KEY AUTOINCREMENT,
            login VARCHAR(254),
            password_hash VARCHAR(254),
            token VARCHAR(16))'''
        )
        cursor.close()
        self.connection.commit()

    def insert(self, login, password, ip):
        cursor = self.connection.cursor()
        cursor.execute(
            '''INSERT INTO admins (login, password_hash, date_of_creation, ip)
               VALUES (?,?,?,?)''', (login, pbkdf2_sha256.hash(password), time(), ip)
        )
        cursor.close()
        self.connection.commit()

    def get(self, login):
        cursor = self.connection.cursor()
        cursor.execute(
            '''SELECT * FROM admins WHERE login = ?''', (login,)
        )
        row = cursor.fetchone()
        return row

    def get_password_hash(self, login):
        cursor = self.connection.cursor()
        cursor.execute('''SELECT password_hash FROM admins WHERE login = ?''', (login,))
        row = cursor.fetchone()
        return row

    def check_password(self, login, password):
        row = self.get_password_hash(login)
        if not row:
            print("[\x1b[31mWARNING\x1b[0m] - User does not exist")
            return None

        password_hash = row[0]
        if pbkdf2_sha256.verify(password, password_hash):
            token = ''.join(choices(ascii_letters + digits + punctuation, k=16))
            print(f"[\x1b[32mOK\x1b[0m] - Admin {login}")
            return token
        print("[\x1b[31mFAILED\x1b[0m] - Password is not suitable")
        return None


# TODO: сделать возможность внесения изменений
class ClientsTable(AbstractTable):
    def __init__(self, connection):
        super().__init__(connection)

    def init_table(self):
        cursor = self.connection.cursor()
        cursor.execute(
            '''CREATE TABLE IF NOT EXISTS clients
            (id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_name VARCHAR(254),
            date_of_birth VARCHAR(10),
            phone_number VARCHAR(19),
            email VARCHAR(254),
            client_status INTEGER DEFAULT 1,
            date_of_creation TIMESTAMP,
            token VARCHAR(16))'''
        )
        cursor.close()
        self.connection.commit()

    def insert(self, client_name, date, ph_number, email, status=2):
        cursor = self.connection.cursor()
        cursor.execute(
            '''INSERT INTO clients
                (client_name, date_of_birth, phone_number, email, date_of_creation, client_status)
               VALUES (?,?,?,?,?,?)''', (client_name, date, ph_number, email, time(), status)
        )
        cursor.close()
        self.connection.commit()

    def set_client_status(self, client_name, status):
        cursor = self.connection.cursor()
        cursor.execute(
            '''UPDATE clients
                SET client_status = ?
                WHERE client_name = ?''', (status, client_name)
        )
        cursor.close()
        self.connection.commit()

    def get(self, client_id):
        cursor = self.connection.cursor()
        cursor.execute(
            '''SELECT * FROM clients WHERE id = ?''', (client_id,)
        )
        row = cursor.fetchone()
        return row

    def get_all(self):
        cursor = self.connection.cursor()
        cursor.execute(
            '''SELECT * FROM clients'''
        )
        rows = cursor.fetchall()
        return rows

    def get_client_id(self, name, date_of_birth):
        cursor = self.connection.cursor()
        cursor.execute(
            '''SELECT id FROM clients
               WHERE client_name=? and date_of_birth=?''', (name, date_of_birth)
        )
        row = cursor.fetchone()
        return row


# TODO: сделать возможность внесения изменений
class ParentsTable(AbstractTable):
    def __init__(self, connection):
        super().__init__(connection)

    def init_table(self):
        cursor = self.connection.cursor()
        cursor.execute(
            '''CREATE TABLE IF NOT EXISTS parents
            (id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER,
            first_parent_name VARCHAR(254),
            first_parent_number VARCHAR(19),
            first_parent_email VARCHAR(254),
            first_parent_work VARCHAR(254) ,
            second_parent_name VARCHAR(254),
            second_parent_number VARCHAR(19),
            second_parent_email VARCHAR(254),
            second_parent_work VARCHAR(254))'''
        )
        cursor.close()
        self.connection.commit()

    def insert(self, client_id,
               first_parent_name, first_parent_number, first_parent_email, first_parent_work,
               second_parent_name, second_parent_number, second_parent_email, second_parent_work):
        cursor = self.connection.cursor()
        cursor.execute(
            '''INSERT INTO parents
                (client_id, first_parent_name, first_parent_number, first_parent_email,
                 first_parent_work, second_parent_name, second_parent_number,
                  second_parent_email, second_parent_work)
               VALUES (?,?,?,?,?,?,?,?,?)''', (
                client_id, first_parent_name, first_parent_number,
                first_parent_email, first_parent_work,
                second_parent_name, second_parent_number,
                second_parent_email, second_parent_work
            )
        )
        cursor.close()
        self.connection.commit()

    def get(self, client_id):
        cursor = self.connection.cursor()
        cursor.execute(
            '''SELECT *
               FROM parents WHERE client_id = ?''', (client_id,)
        )
        row = cursor.fetchone()
        return row


class HistoryTable(AbstractTable):
    def __init__(self, connection):
        super().__init__(connection)

    def init_table(self):
        cursor = self.connection.cursor()
        cursor.execute(
            '''CREATE TABLE IF NOT EXISTS history(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id INTEGER,
                program_name VARCHAR(254),
                country VARCHAR(254),
                status INTEGER DEFAULT 2,
                type INTEGER,
                departure_date VARCHAR(10),
                date_of_creation TIMESTAMP,
                user_commit TEXT
            )'''
        )
        cursor.close()
        self.connection.commit()

    def insert(self, client_id, program_name, country, program_type, departure_date, commit, status=1):
        cursor = self.connection.cursor()
        cursor.execute(
            '''INSERT INTO history
                (client_id, program_name, country, type, departure_date, date_of_creation, user_commit, status)
               VALUES (?,?,?,?,?,?,?)''', (
                client_id,
                program_name,
                country,
                program_type,
                departure_date,
                time(),
                commit,
                status
            )
        )
        cursor.close()
        self.connection.commit()

    def set_status(self, client_id, status):
        cursor = self.connection.cursor()
        cursor.execute(
            '''UPDATE history
               SET status=? WHERE client_id = ?''', (status, client_id)
        )
        cursor.close()
        self.connection.commit()

    def get_all_client_applications(self, client_id):
        cursor = self.connection.cursor()
        cursor.execute(
            '''SELECT *
               FROM history WHERE id = ?''', (client_id,)
        )
        row = cursor.fetchall()
        return row


class CurrentRequestsTable(AbstractTable):
    def __init__(self, connection):
        super().__init__(connection)

    def init_table(self):
        cursor = self.connection.cursor()
        cursor.execute(
            '''CREATE TABLE IF NOT EXISTS current(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id INTEGER,
                program_name VARCHAR(254),
                country VARCHAR(254),
                status INTEGER DEFAULT 1,
                type INTEGER,
                departure_date VARCHAR(10),
                date_of_creation TIMESTAMP,
                user_commit TEXT
            )'''
        )
        cursor.close()
        self.connection.commit()

    def insert(self, client_id, program_name, country, program_type, departure_date, commit, status=1):
        cursor = self.connection.cursor()
        cursor.execute(
            '''INSERT INTO current(client_id, program_name, country, type,
             departure_date, date_of_creation, user_commit, status)
               VALUES (?,?,?,?,?,?,?,?)''', (
                client_id,
                program_name,
                country,
                program_type,
                departure_date,
                time(),
                commit,
                status
            )
        )
        cursor.close()
        self.connection.commit()

    def set_status(self, client_id, status):
        cursor = self.connection.cursor()
        cursor.execute(
            '''UPDATE current
               SET status=? WHERE client_id = ?''', (status, client_id)
        )
        cursor.close()
        self.connection.commit()

    def get(self, client_id):
        cursor = self.connection.cursor()
        cursor.execute(
            '''SELECT *
               FROM current WHERE id = ?''', (client_id,)
        )
        row = cursor.fetchone()
        return row

    def pop(self, client_id):
        cursor = self.connection.cursor()
        cursor.execute(
            '''SELECT *
               FROM current WHERE id = ?''', (client_id,)
        )
        row = cursor.fetchone()
        cursor.execute(
            '''DELETE FROM current WHERE id = ?''', (client_id,)
        )
        self.connection.commit()
        return row
