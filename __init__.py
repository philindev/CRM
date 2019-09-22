from flask import Flask, request, render_template
from json import dumps
from database import *
import logging


def time_calculation(obj: dict, time_is_now):
    if obj and obj["date_of_creation"]:
        obj["date_of_creation"] = time_is_now - obj["date_of_creation"]
    return obj["date_of_creation"]


def preparation_of_client_data(client, time_is_now):
    parents = parents_table.get(client[0])
    if not parents:
        parents = [None] * 10

    client = {
        "client_id": client[0],
        "client_name": client[1],
        "date_of_birth": client[2],
        "phone_number": client[3],
        "mail": client[4],
        "client_status": client[5],
        "date_of_creation": client[6],
        "parents": {
            "first_parent": {
                "name": parents[2],
                "phone_number": parents[3],
                "email": parents[4],
                "work": parents[5]
            },
            "second_parent": {
                "name": parents[6],
                "phone_number": parents[7],
                "email": parents[8],
                "work": parents[9]
            }
        }
    }
    client["date_of_creation"] = time_calculation(client, time_is_now)

    current_request = current_requests_table.get(client["client_id"])
    if not current_request:
        current_request = [None] * 8
    else:
        current_request = list(current_request)
        current_request[7] = time_is_now - current_request[7]
    current_request = {
        "program_name": current_request[2],
        "country": current_request[3],
        "status": current_request[4],
        "type": current_request[5],
        "departure_date": current_request[6],
        "date_of_creation": current_request[7]
    }

    client_history = list(map(lambda x: {
        "program_name": x[2] if len(x) > 2 else None,
        "country": x[3] if len(x) > 3 else None,
        "status": x[4] if len(x) > 4 else None,
        "type": x[5] if len(x) > 5 else None,
        "departure_date": x[6] if len(x) > 6 else None,
        "date_of_creation": x[7] if len(x) > 7 else None
    }, history_table.get_all_client_applications(client["client_id"])))

    client_data = {
        "client": client,
        "request": current_request,
        "history": list(map(time_calculation, client_history))
    }

    return client_data


app = Flask(__name__, template_folder="./frontend", static_folder="./frontend")


@app.route('/', methods=["GET"])
def main_page():
    print("[\x1b[31mWARNING\x1b[0m] - Access to the site from ", request.environ['REMOTE_ADDR'])
    print(request.environ)  
    print(request.remote_addr)
    return render_template("index.html")


@app.route("/login", methods=["GET"])
def login():
    return render_template("login.html")


@app.route("/Entry", methods=["GET"])
def entry():
    print("[\x1b[33mINFO\x1b[0m] - Login")

    data = request.json()

    if list(data.keys()) != ["login", "password"]:
        print("[\x1b[31mFAILED\x1b[0m] - Invalid request data")
        return dumps(None)

    response = admins_table.check_password(data["login"], data["password"])
    return dumps(response)
# TODO: определиться, что делать с токеном


@app.route("/UserData", methods=["POST"])
def user_data():
    print("[\x1b[33mINFO\x1b[0m] - UserData")

    data = request.json

    if list(data.keys()) != ['name', 'status', 'date_of_birth', 'number', 'mail', 'firstParent', 'secondParent']:
        print("[\x1b[31mFAILED\x1b[0m] - Invalid request data")
        return dumps(None)

    client_id = clients_table.get_client_id(data["name"], data["date_of_birth"])
    if client_id:
        print("[\x1b[31mWARNING\x1b[0m] - User already exists")
        return dumps(client_id[0])

    first_parent = data["firstParent"]
    second_parent = data["secondParent"]

    if not (first_parent or second_parent):
        print("[\x1b[31mFAILED\x1b[0m] - Missing parents data")
        return dumps(None)

    if not first_parent:
        first_parent["name"] = None
        first_parent["number"] = None
        first_parent["mail"] = None
        first_parent["job"] = None

    if not second_parent:
        second_parent["name"] = None
        second_parent["number"] = None
        second_parent["mail"] = None
        second_parent["job"] = None

    if list(first_parent.keys()) != ["name", "number", "mail", "job"] or \
            list(second_parent.keys()) != ["name", "number", "mail", "job"]:
        print("[\x1b[31mFAILED\x1b[0m] - Invalid parents data")
        return dumps(None)

    clients_table.insert(data["name"], data["date_of_birth"], data["number"], data["mail"],
                         1 if data["status"] == "V.I.P." else
                         2 if data["status"] == "Новый" else
                         3 if data["status"] == "Повторный" else 0)
    print("[\x1b[32mOK\x1b[0m] - User created")

    client_id = clients_table.get_client_id(data["name"], data["date_of_birth"])[0]

    parents_table.insert(
        client_id,
        first_parent["name"] if first_parent["name"] else None,
        first_parent["number"] if first_parent["number"] else None,
        first_parent["mail"] if first_parent["mail"] else None,
        first_parent["job"] if first_parent["job"] else None,
        second_parent["name"] if second_parent["name"] else None,
        second_parent["number"] if second_parent["number"] else None,
        second_parent["mail"] if second_parent["mail"] else None,
        second_parent["job"] if second_parent["job"] else None
    )
    print("[\x1b[32mOK\x1b[0m] - User’s parents are recorded")
    # token = "generating_token"
    return dumps(client_id)


@app.route("/ChangeClient")
def change_client():
    data = request.json()
    if list(data.keys()) != ["token", "client"]:
        print("[\x1b[31mFAILED\x1b[0m] - Invalid request data")
        return dumps(None)

    new_client_data = data["client"]

    clients_table.change(
        new_client_data["id"], new_client_data["name"],
        new_client_data["date_of_birth"], new_client_data["mail"],
        new_client_data["phone_number"]
    )
    # TODO: доделать изменения, добавить проверку для безопастности


@app.route("/UserRequest", methods=["POST"])
def user_request():
    print("[\x1b[33mINFO\x1b[0m] - UserRequest")

    data = request.json

    if list(data.keys()) != ["name_of_program", "status", "country", "where_from",
                             "date_of_will_fly", "comment", "type_of_program", "id"]:
        print("[\x1b[31mFAILED\x1b[0m] - Invalid request data")
        return dumps(None)

    client_id = data["id"]

    if not clients_table.get(client_id):
        print("[\x1b[31mFAILED\x1b[0m] - User does not exist")
        return dumps(None)

    elif current_requests_table.get(client_id):
        print("[\x1b[31mFAILED\x1b[0m] - User already has an open application")
        return dumps(None)

    current_requests_table.insert(client_id, data["name_of_program"],
                                  data["country"], data["type_of_program"],
                                  data["date_of_will_fly"], data["comment"],
                                  1 if data["status"] == "Заявка" else
                                  2 if data["status"] == "Договор" else
                                  3 if data["status"] == "Оплата" else
                                  4 if data["status"] == "Вылет" else
                                  5 if data["status"] == "Консультирование" else 0)

    print("[\x1b[32mOK\x1b[0m] - Application is recorded")
    return dumps("I hacked your system")


@app.route("/GetInfo", methods=["GET"])
def get_client():
    print("[\x1b[33mINFO\x1b[0m] - GetInfo")

    time_is_now = time()
    response = []

    for client in clients_table.get_all():
        response.append(preparation_of_client_data(client, time_is_now))

    print("[\x1b[32mOK\x1b[0m] - GetInfo")
    return dumps(response)


@app.route("/Search", methods=["POST"])
def search():
    print("[\x1b[33mINFO\x1b[0m] - Search")
    data = request.json
    print("[\x1b[33mINFO\x1b[0m] - Search data: ", data)
    time_is_now = time()
    phone = data["phone_number"]
    line = data["searchLine"].split()

    if phone:
        if len(line) > 1:
            if len(phone) == 12:
                f = lambda x: x[1].lower() == ' '.join(line).lower() and x[3] == phone
            else:
                f = lambda x: x[1].lower() == ''.join(line).lower() and phone in x[3]
        elif line:
            if len(phone) == 12:
                f = lambda x: ' '.join(line).lower() in x[1].lower() and x[3] == phone
            else:
                f = lambda x: ' '.join(line).lower() in x[1].lower() and phone in x[3]
        else:
            if len(phone) == 12:
                f = lambda x: x[3] == phone
            else:
                f = lambda x: phone in x[3]
    else:
        if len(line) > 1:
            f = lambda x: ' '.join(line).lower() == x[1].lower()
        elif line:
            f = lambda x: ' '.join(line).lower() in x[1].lower()
        else:
            print("[\x1b[31mFAILED\x1b[0m] - Empty search query")
            return dumps(None)

    res = clients_table.get_all()
    res = list(filter(f, res))
    response = []

    for client in res:
        response.append(preparation_of_client_data(client, time_is_now))

    print("[\x1b[33mINFO\x1b[0m] - Number of coincidences:", len(response))
    print("[\x1b[32mOK\x1b[0m] - Search completed")
    return dumps(response)


if __name__ == "__main__":
    # TODO: logging
    # console_handler = logging.StreamHandler()
    # file_handler = logging.FileHandler(".log.txt")

    # db = DB(''.join(choices(ascii_letters + digits, k=16)))
    total_error = 0
    errors = []
    # start time
    t = "|" + " " * 5 + f"Start in {time()}" + " " * 5 + "|"
    print(
        len(t) * "_" +
        "\n|" + (len(t) - 2) * " " + "|\n" +
        t +
        "\n|" + (len(t) - 2) * " " + "|\n" +
        len(t) * "_"
    )

    db = DB("database")
    print("[\x1b[32mOK\x1b[0m] - Created or opened database | " f"Name {db.name}")

    admins_table = AdminsTable(db.get_connection())
    if admins_table.get_error() == "1":
        print("[\x1b[32mOK\x1b[0m] - AdminsTable connected to the database")
    else:
        print("[\x1b[31mFAILED\x1b[0m] - AdminsTable could not connect to the database")
        total_error += 1
        errors.append(f"AdminsTableError {time()}\n#{admins_table}")

    clients_table = ClientsTable(db.get_connection())
    if clients_table.get_error() == "-1":
        print("[\x1b[32mOK\x1b[0m] - ClientsTable connected to the database")
    else:
        print("[\x1b[31mFAILED\x1b[0m] - ClientsTable could not connect to the database")
        total_error += 1
        errors.append(f"ClientsTableError {time()}\n#{clients_table}")

    parents_table = ParentsTable(db.get_connection())
    if parents_table.get_error() == "-1":
        print("[\x1b[32mOK\x1b[0m] - ParentsTable connected to the database")
    else:
        print("[\x1b[31mFAILED\x1b[0m] - ParentsTable could not connect to the database")
        total_error += 1
        errors.append(f"ParentsTableError {time()}\n#{parents_table}")

    history_table = HistoryTable(db.get_connection())
    if history_table.get_error() == "-1":
        print("[\x1b[32mOK\x1b[0m] - HistoryTable connected to the database")
    else:
        print("[\x1b[31mFAILED\x1b[0m] - HistoryTable could not connect to the database")
        total_error += 1
        errors.append(f"HistoryTableError {time()}\n#{history_table}")

    current_requests_table = CurrentRequestsTable(db.get_connection())
    if current_requests_table.get_error() == "-1":
        print("[\x1b[32mOK\x1b[0m] - CurrentsRequests connected to the database")
    else:
        print("[\x1b[31mFAILED\x1b[0m] - CurrentsRequests could not connect to the database")
        total_error += 1
        errors.append(f"CurrentsRequestsTableError {time()}\n#{current_requests_table}")

    admins_table.init_table()
    clients_table.init_table()
    parents_table.init_table()
    history_table.init_table()
    current_requests_table.init_table()

    # if total_error:
    #     with open(".log.txt", "a") as log:
    #         log.write("\n".join(errors))
    #     print("Failure to start due to errors. Read more in the log file.")

    app.run(port=8000, host="127.0.0.1")
