from sqlite3 import connect
from passlib.hash import pbkdf2_sha256
from string import ascii_letters, digits, punctuation
from random import choices
from time import time
from logging import getLogger
from logging.handlers import RotatingFileHandler


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
        self.connection = connection
        try:
            self.connection.cursor()
        except AttributeError:
            self.error = 1
        else:
            self.error = -1

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
                         status INTEGER,
                         token VARCHAR(16))'''
        )
        cursor.close()
        self.connection.commit()

    def insert(self, login, password, status=1):  # ip
        cursor = self.connection.cursor()
        cursor.execute(
            '''INSERT INTO admins (login, password_hash, date_of_creation, status)  
               VALUES (?,?,?,?)''', (login, pbkdf2_sha256.hash(password), time(), status)  # ip
        )
        cursor.close()
        self.connection.commit()

    def set_token(self, login, token):
        cursor = self.connection.cursor()
        cursor.execute(
            '''UPDATE admins
                SET token = ?
                WHERE login = ?''', (token, login)
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
        cursor.execute('''SELECT password_hash, status FROM admins WHERE login = ?''', (login,))
        row = cursor.fetchone()
        return row

    def check_password(self, login, password):
        row = self.get_password_hash(login)
        if not row:
            logger.info("[FAILED] - User does not exist")
            return None

        password_hash = row[0]
        if pbkdf2_sha256.verify(password, password_hash):
            token = ''.join(choices(ascii_letters + digits + "!%&'()*+, -.:;<=>@[]^_`{|}~", k=16))
            status = "Guest" if row[1] == 1 else \
                     "User" if row[1] == 2 else \
                     "Admin" if row[1] == 3 else None
            logger.info(f"[INFO] - {status} {login}")
            self.set_token(login, token)
            return {"token": token, "status": status}
        logger.info("[FAILED] - Password is not suitable")
        return None

    def check_access(self, token):
        cursor = self.connection.cursor()
        cursor.execute(
            '''SELECT status FROM admins WHERE token = ?''', (token,)
        )
        row = cursor.fetchone()
        if not row:
            return False
        return 1 if row[0] == 3 else 0 if row[0] in [1, 2] else -1


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

    def change(self, client_id, new_name,
               new_date_of_birth, new_mail, new_phone_number,
               first_parent, second_parent, parents_table):
        row = self.get(client_id)
        if not row:
            logger.warning("[WARNING]] - Attempt to modify a nonexistent user")
            return False

        cursor = self.connection.cursor()
        cursor.execute(

            '''UPDATE clients
                SET client_name = ?,
                    date_of_birth = ?,
                    phone_number = ?,
                    email = ?
                WHERE id = ?''', (new_name, new_date_of_birth, new_mail, new_phone_number, client_id)
        )
        cursor.close()
        self.connection.commit()
        parents_table.change(client_id, first_parent, second_parent)
        return True

    def delete(self, client_id):
        cursor = self.connection.cursor()
        cursor.execute(
            '''DELETE FROM clients
                WHERE id = ?''', (client_id,)
        )
        cursor.close()
        self.connection.commit()


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

    def change(self, client_id, first_parent, second_parent):
        cursor = self.connection.cursor()
        cursor.execute(
            '''UPDATE parents
                SET first_parent_name = ?,
                    first_parent_number = ?,
                    first_parent_email = ?,
                    first_parent_work = ?,
                    second_parent_name = ?,
                    second_parent_number = ?,
                    second_parent_email = ?,
                    second_parent_work = ?
                WHERE client_id = ?''', (
                first_parent["name"], first_parent["number"], first_parent["mail"], first_parent["job"],
                second_parent["name"], second_parent["number"], second_parent["mail"], second_parent["job"],
                client_id
            )
        )
        cursor.close()
        self.connection.commit()


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
                user_commit TEXT,
                money REAL DEFAULT 0,
                cause TEXT,
                brief VARCHAR(100)
            )'''
        )
        cursor.close()
        self.connection.commit()

    def insert(self, client_id, program_name, country, program_type, departure_date, date_of_creation, commit,
               status=6, money=0, cause="", brief=""):
        cursor = self.connection.cursor()
        cursor.execute(
            '''INSERT INTO history
                (client_id, program_name, country, type, departure_date, date_of_creation,
                 user_commit, status, money, cause, brief)
               VALUES (?,?,?,?,?,?,?,?,?,?,?)''', (
                client_id,
                program_name,
                country,
                program_type,
                departure_date,
                date_of_creation,
                commit,
                status,
                money,
                cause,
                brief
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
               FROM history WHERE client_id = ?''', (client_id,)
        )
        row = cursor.fetchall()
        return row

    def get_closed_applications(self):
        cursor = self.connection.cursor()
        cursor.execute(
            '''SELECT 
                id, 
                client_id,
                program_name,
                country,
                status,
                type,
                departure_date,
                user_commit,
                money
               FROM history WHERE status = 6'''
        )
        row = cursor.fetchall()
        return row

    def get_refused_applications(self):
        cursor = self.connection.cursor()
        cursor.execute(
            '''SELECT
                id, 
                client_id,
                program_name,
                country,
                status,
                type,
                departure_date,
                user_commit,
                cause,
                brief
               FROM history WHERE status = 7'''
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
                type INTEGER,
                departure_date VARCHAR(10),
                date_of_creation TIMESTAMP,
                user_commit TEXT,
                status INTEGER DEFAULT 1
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

    def change(self, client_id, program_name, country, program_type, departure_date, commit):
        cursor = self.connection.cursor()
        cursor.execute(
            '''UPDATE current
                SET program_name = ?,
                    country = ?,
                    type = ?, 
                    departure_date = ?,
                    user_commit = ?
                WHERE client_id = ?''', (
                program_name, country,
                program_type, departure_date,
                commit, client_id)
        )
        cursor.close()
        self.connection.commit()

    def set_status(self, client_id, status):
        cursor = self.connection.cursor()
        cursor.execute(
            '''UPDATE current
               SET status=?, date_of_creation=? WHERE client_id = ?''', (status, time(), client_id)
        )
        cursor.close()
        self.connection.commit()

    def get_all(self):
        cursor = self.connection.cursor()
        cursor.execute(
            '''SELECT * FROM current'''
        )
        rows = cursor.fetchall()
        return rows

    def get(self, client_id):
        cursor = self.connection.cursor()
        cursor.execute(
            '''SELECT *
               FROM current WHERE client_id = ?''', (client_id,)
        )
        row = cursor.fetchone()
        return row

    def pop(self, client_id):
        cursor = self.connection.cursor()
        cursor.execute(
            '''SELECT *
               FROM current WHERE client_id = ?''', (client_id,)
        )
        row = cursor.fetchone()
        cursor.execute(
            '''DELETE FROM current WHERE id = ?''', (row[0],)
        )
        self.connection.commit()
        return row


handler = RotatingFileHandler('log.log', maxBytes=1024 * 1024 * 100)
logger = getLogger('database')
