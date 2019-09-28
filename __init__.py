from flask import Flask, request, render_template
from json import dumps
from database import *
import logging


def time_calculation(obj: dict, time_is_now):
    if obj and obj["date_of_creation"]:
        obj["date_of_creation"] = time_is_now - obj["date_of_creation"] // 86400
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


def log_connect_table(table, ):
    if table.get_error() == "-1":
        log(1, f"{table.__class__.__name__} connected to the database")
        return 0
    log(2, f"{table.__class__.__name__} could not connect to the database")
    return 1


app = Flask(__name__, template_folder="./frontend", static_folder="./frontend")


@app.route('/', methods=["GET"])
def main_page():
    log(3, "Access to the site from " + request.environ['REMOTE_ADDR'])
    print(request.environ)
    print(request.remote_addr)
    return render_template("index.html")


@app.route("/login", methods=["GET"])
def login():
    return render_template("login.html")


@app.route("/Entry", methods=["POST"])
def entry():
    log(0, "Login")
    data = request.json

    if list(data.keys()) != ["login", "password"]:
        log(3, "Invalid request data")
        return dumps(None)

    response = admins_table.check_password(data["login"], data["password"])
    return dumps(response)


@app.route("/UserData", methods=["POST"])
def user_data():
    log(0, "UserData")

    data = request.json

    if list(data.keys()) != ['name', 'status', 'date_of_birth', 'number', 'mail', 'firstParent', 'secondParent']:
        log(3, "Invalid request data")
        return dumps(None)

    client_id = clients_table.get_client_id(data["name"], data["date_of_birth"])
    if client_id:
        log(2, "User already exists")
        return dumps(client_id[0])

    first_parent = data["firstParent"]
    second_parent = data["secondParent"]

    if not (first_parent or second_parent):
        log(2, "Missing parents data")
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
        log(3, "Invalid parents data")
        return dumps(None)

    clients_table.insert(data["name"], data["date_of_birth"], data["number"], data["mail"],
                         1 if data["status"] == "V.I.P." else
                         2 if data["status"] == "Новый" else
                         3 if data["status"] == "Повторный" else 0)
    log(0, "User created")

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
    log(0, "User’s parents are recorded")
    return dumps(client_id)


@app.route("/ChangeClient")
def change_client():
    data = request.json
    if list(data.keys()) != ["token", "client"]:
        log(3, "Invalid request data")
        return dumps(None)

    new_client_data = data["client"]

    if list(data.keys()) != ["id", "name", "date_of_birth",
                             "mail", "phone_number", "status",
                             "first_parent", "second_parent"]:
        log(3, "Invalid client data")
        return dumps(None)

    elif list(data["first_parent"].keys()) != ["name", "number", "mail", "job"]:
        log(3, "Invalid first parent data")
        return dumps(None)

    elif list(data["second_parent"].keys()) != ["name", "number", "mail", "job"]:
        log(3, "Invalid second parent data")
        return dumps(None)

    elif not admins_table.check_access(data["token"]):
        log(2, "Token failed verification")
        return dumps(None)

    if not clients_table.change(new_client_data["id"], new_client_data["name"],
                                new_client_data["date_of_birth"], new_client_data["mail"],
                                new_client_data["phone_number"], new_client_data["status"],
                                new_client_data["first_parent"], new_client_data["second_parent"],
                                parents_table):
        log(1, "ChangeClient")

    return dumps("Changed")


@app.route("/ChangeCurrent")
def change_current():
    data = request.json
    if list(data.keys()) != ["token", "name_of_program", "status", "country", "where_from",
                             "date_of_will_fly", "comment", "type_of_program", "id"]:
        log(3, "Invalid request data")
        return dumps(None)

    client_id = data["id"]

    if not clients_table.get(client_id):
        log(2, "User does not exist")
        return dumps(None)

    elif current_requests_table.get(client_id):
        log(2, "User already has an open application")
        return dumps(None)

    check = admins_table.check_access(data["token"])

    if check == 0:
        log(2, "Token failed verification")
        return dumps(None)

    elif not check:
        log(3, "Token does not exist")
        return dumps(None)

    elif check == -1:
        log(3, "Admin has incorrect status")
        return dumps(None)

    current_requests_table.change(client_id, data["name_of_program"],
                                  data["country"], data["type_of_program"],
                                  data["date_of_will_fly"], data["comment"])
    log(1, "Application changed")
    return dumps("I hacked your system again")


@app.route("/ChangeCurrentStatus")
def change_current_status():
    data = request.json
    if list(data.keys()) != ["token", "status", "id"]:
        log(3, "Invalid request data")
        return dumps(None)

    client_id = data["id"]

    if not clients_table.get(client_id):
        log(2, "User does not exist")
        return dumps(None)

    elif current_requests_table.get(client_id):
        log(2, "User already has an open application")
        return dumps(None)

    check = admins_table.check_access(data["token"])

    if check == 0:
        log(2, "Token failed verification")
        return dumps(None)

    elif not check:
        log(3, "Token does not exist")
        return dumps(None)

    elif check == -1:
        log(3, "Admin has incorrect status")
        return dumps(None)

    current_requests_table.set_status(client_id,
                                      1 if data["status"] == "Заявка" else
                                      2 if data["status"] == "Договор" else
                                      3 if data["status"] == "Оплата" else
                                      4 if data["status"] == "Вылет" else
                                      5 if data["status"] == "Консультирование" else 0)
    log(1, "Application changed")
    return dumps("I hacked your system again")


@app.route("/UserRequest", methods=["POST"])
def user_request():
    log(0, "UserRequest")

    data = request.json

    if list(data.keys()) != ["name_of_program", "status", "country", "where_from",
                             "date_of_will_fly", "comment", "type_of_program", "id"]:
        log(3, "Invalid request data")
        return dumps(None)

    client_id = data["id"]

    if not clients_table.get(client_id):
        log(2, "User does not exist")
        return dumps(None)

    elif current_requests_table.get(client_id):
        log(2, "User already has an open application")
        return dumps(None)

    current_requests_table.insert(client_id, data["name_of_program"],
                                  data["country"], data["type_of_program"],
                                  data["date_of_will_fly"], data["comment"],
                                  1 if data["status"] == "Заявка" else
                                  2 if data["status"] == "Договор" else
                                  3 if data["status"] == "Оплата" else
                                  4 if data["status"] == "Вылет" else
                                  5 if data["status"] == "Консультирование" else 0)

    log(1, "Application is recorded")
    return dumps("I hacked your system")


@app.route("/GetInfo", methods=["GET"])
def get_client():
    log(0, "GetInfo")

    time_is_now = time()
    response = []

    for client in clients_table.get_all():
        response.append(preparation_of_client_data(client, time_is_now))

    log(1, "GetInfo")
    return dumps(response)


@app.route("/Search", methods=["POST"])
def search():
    log(0, "Search")
    data = request.json
    log(0, f"Search data: {data}")
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
            log(2, "Empty search query")
            return dumps(None)

    res = clients_table.get_all()
    res = list(filter(f, res))
    response = []

    for client in res:
        response.append(preparation_of_client_data(client, time_is_now))

    log(0, f"Number of coincidences: {len(response)}")
    log(1, "Search completed")
    return dumps(response)


if __name__ == "__main__":
    # TODO: logging
    # console_handler = logging.StreamHandler()
    # file_handler = logging.FileHandler(".log.txt")

    total_error = 0
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
    log(1, f"Created or opened database | Name {db.name}")

    admins_table = AdminsTable(db.get_connection())
    total_error += log_connect_table(admins_table)

    clients_table = ClientsTable(db.get_connection())
    total_error += log_connect_table(clients_table)

    parents_table = ParentsTable(db.get_connection())
    total_error += log_connect_table(parents_table)

    history_table = HistoryTable(db.get_connection())
    total_error += log_connect_table(history_table)

    current_requests_table = CurrentRequestsTable(db.get_connection())
    total_error += log_connect_table(current_requests_table)

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
