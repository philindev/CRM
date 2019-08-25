from sqlite3 import connect


class DB:
    def __init__(self, db_name):
        conn = connect(db_name + ".db", check_same_thread=False)
        self.conn = conn

    def get_connection(self):
        return self.conn

    def __del__(self):
        self.conn.close()


class ClientsTable:
    def __init__(self, connection):
        self.connection = connection

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
            application_status INTEGER DEFAULT 1)'''
        )
        cursor.close()
        self.connection.commit()

    def insert(self, client_name, date, ph_number, email):
        cursor = self.connection.cursor()
        cursor.execute(
            '''INSERT INTO clients 
                (client_name, date_of_birth, phone_number, email) 
               VALUES (?,?,?,?)''', (client_name, date, ph_number, email)
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

    def set_application_status(self, client_name, status):
        cursor = self.connection.cursor()
        cursor.execute(
            '''UPDATE clients 
                SET application_status = ?
                WHERE client_name = ?''', (status, client_name)
        )
        cursor.close()
        self.connection.commit()

    def get(self, client_id):
        cursor = self.connection.cursor()
        cursor.execute(
            '''SELECT date_of_birth,
                      phone_number,
                      email
               FROM clients WHERE id = ?''', (client_id,)
        )
        row = cursor.fetchone()
        return row

    def get_all(self):
        cursor = self.connection.cursor()
        cursor.execute(
            '''SELECT client_name,
                      date_of_birth,
                      phone_number,
                      email,
                      client_status,
                      application_status
               FROM clients'''
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


class ParentsTable:
    def __init__(self, connection):
        self.connection = connection

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
               FROM clients WHERE client_id = ?''', (client_id,)
        )
        row = cursor.fetchone()
        return row
