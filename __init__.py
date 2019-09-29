from flask import Flask, request, render_template, send_from_directory
from json import dumps
from pandas import DataFrame, ExcelWriter
from database import *
import logging


def time_calculation(obj: dict, time_is_now):
    if obj and obj["date_of_creation"]:
        obj["date_of_creation"] = time_is_now - obj["date_of_creation"] // 86400
    return obj["date_of_creation"]


def preparation_request(request_for_preparation):
    new_request = {
        "program_name": request_for_preparation[2] if len(request_for_preparation) > 2 else
        log("3", "In history_table is not fully filled request"),
        "country": request_for_preparation[3] if len(request_for_preparation) > 3 else
        log("3", "In history_table is not fully filled request"),
        "status": request_for_preparation[4] if len(request_for_preparation) > 4 else
        log("3", "In history_table is not fully filled request"),
        "type": request_for_preparation[5] if len(request_for_preparation) > 5 else
        log("3", "In history_table is not fully filled request"),
        "departure_date": request_for_preparation[6] if len(request_for_preparation) > 6 else
        log("3", "In history_table is not fully filled request"),
        "date_of_creation": request_for_preparation[7] if len(request_for_preparation) > 7 else
        log("3", "In history_table is not fully filled request"),
        "user_commit": request_for_preparation[8] if len(request_for_preparation) > 8 else
        log("3", "In history_table is not fully filled request"),

    }
    if new_request["status"] == 6:
        new_request["money"] = request_for_preparation[9] if len(request_for_preparation) > 9 else \
                                   log("3", "In history_table is not fully filled request"),

    elif new_request["status"] == 7:
        new_request["cause"] = request_for_preparation[10] if len(request_for_preparation) > 10 else \
                                   log("3", "In history_table is not fully filled request"),
        new_request["brief"] = request_for_preparation[11] if len(request_for_preparation) > 11 else \
            log("3", "In history_table is not fully filled request")

    else:
        log("3", "In history_table does not correctly indicate the status"),

    return new_request


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

    client_history = list(map(preparation_request, history_table.get_all_client_applications(client["client_id"])))

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


@app.route("/ChangeClient", methods=["POST"])
def change_client():
    data = request.json
    if list(data.keys()) != ["token", "client"]:
        log(3, "Invalid request data")
        return dumps(None)

    new_client_data = data["client"]
    if list(new_client_data.keys()) != ["id", "name", "date_of_birth",
                                        "mail", "phone_number",
                                        "first_parent", "second_parent"]:
        log(3, "Invalid client data")
        return dumps(None)

    elif list(new_client_data["first_parent"].keys()) != ["name", "number", "mail", "job"]:
        log(3, "Invalid first parent data")
        return dumps(None)

    elif list(new_client_data["second_parent"].keys()) != ["name", "number", "mail", "job"]:
        log(3, "Invalid second parent data")
        return dumps(None)

    check = admins_table.check_access(data["token"])
    if check != 1:
        if check == -1:
            log(3, "Token failed verification")
        else:
            log(2, "Token does not have access ")
        return dumps(None)

    if not clients_table.change(new_client_data["id"], new_client_data["name"],
                                new_client_data["date_of_birth"], new_client_data["mail"],
                                new_client_data["phone_number"], new_client_data["first_parent"],
                                new_client_data["second_parent"], parents_table):
        return dumps(None)
    log(1, "ChangeClient")
    return dumps("Changed")


@app.route("/ChangeCurrent", methods=["POST"])
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

    if check != 1:
        if check == -1:
            log(3, "Token failed verification")
        else:
            log(2, "Token does not have access ")
        return dumps(None)

    current_requests_table.change(client_id, data["name_of_program"],
                                  data["country"], data["type_of_program"],
                                  data["date_of_will_fly"], data["comment"])
    log(1, "Application changed")
    return dumps("I hacked your system again")


@app.route("/ChangeCurrentStatus", methods=["POST"])
def change_current_status():
    global is_closed_application_file, is_refused_application_file
    is_closed_application_file = False
    is_refused_application_file = False

    data = request.json
    if list(data.keys()) != ["token", "status", "data"]:
        log(3, "Invalid request data")
        return dumps(None)

    client_id = data["data"]["id"]

    if not clients_table.get(client_id):
        log(2, "User does not exist")
        return dumps(None)

    elif current_requests_table.get(client_id):
        log(2, "User already has an open application")
        return dumps(None)

    check = admins_table.check_access(data["token"])

    if check != 1:
        if check == -1:
            log(3, "Token failed verification")
        else:
            log(2, "Token does not have access ")
        return dumps(None)
    if data["status"] == "Закрыто":
        current_request = current_requests_table.pop(client_id)
        history_table.insert(current_request[1], current_request[2], current_request[3], current_request[4],
                             current_request[5], current_request[6], current_request[7],
                             status=6, money=data["data"]["money"])

    elif data["status"] == "Отказ":
        current_request = current_requests_table.pop(client_id)
        history_table.insert(current_request[1], current_request[2], current_request[3], current_request[4],
                             current_request[5], current_request[6], current_request[7],
                             status=7, cause=data["data"]["cause"], brief=data["data"]["brief"])
    else:
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
def get_info():
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
    if list(data.keys()) == ["searchLine", "phone_number", "status"]:
        log(3, "Invalid request data")
        return dumps(None)
    time_is_now = time()
    phone = data["phone_number"]
    line = data["searchLine"].split()
    status = data["status"].lower()
    status = 1 if status == "заявка" else \
             2 if status == "договор" else \
             3 if status == "оплата" else \
             4 if status == "вылет" else \
             5 if status == "консультирование" else 0

    line_f = "f = lambda x:"
    if len(line) > 1:
        line_f += "x[1].lower() == ' '.join(line).lower()"

    if phone:
        if len(line_f) > 13:
            line_f += " and "

        if len(phone) == 12:
            line_f += "x[3] == phone"

        else:
            line_f += "phone in x[3]"

    if status:
        ff = lambda x: x["request"]["status"] == status
    else:
        ff = lambda x: True

    if line_f == 13:
        log(2, "Empty search query")
        return dumps(None)

    f = lambda x: True
    exec(line_f)
    res = clients_table.get_all()
    res = list(filter(f, res))
    response = []

    for client in res:
        response.append(preparation_of_client_data(client, time_is_now))
    response = list(filter(ff, response))
    log(0, f"Number of coincidences: {len(response)}")
    log(1, "Search completed")
    return dumps(response)


@app.route("/Download/closed", methods=["POST"])
def download_closed():
    global is_closed_application_file

    data = request.json
    if list(data.keys()) == ["token"]:
        log(3, "Invalid request data")
        return dumps(None)

    check = admins_table.check_access(data["token"])

    if check != 1:
        if check == -1:
            log(3, "Token failed verification")
        else:
            log(2, "Token does not have access")
        return dumps(None)

    if not is_closed_application_file:
        applications = history_table.get_closed_applications()
        data_for_excel = {
            "id": [],
            "client_id": [],
            "client_name": [],
            "name_of_program": [],
            "country": [],
            "status": [],
            "type": [],
            "departure_date": [],
            "user_commit": [],
            "money": []
        }

        for application in applications:
            data_for_excel["id"].append(application[0])
            data_for_excel["client_id"].append(application[1])
            data_for_excel["name_of_program"].append(application[2])
            data_for_excel["country"].append(application[3])
            data_for_excel["status"].append(application[4])
            data_for_excel["type"].append(application[5])
            data_for_excel["departure_date"].append(application[6])
            data_for_excel["user_commit"].append(application[7])
            data_for_excel["money"].append(application[8])
            data_for_excel["client_name"].append(clients_table.get(application[1])[1])

        df = DataFrame(data_for_excel)
        writer = ExcelWriter("closed_applications.xlsx")
        df.to_excel(writer, "Closed", index=False)
        writer.save()
        is_closed_application_file = True

    log(1, "Closed file sent")
    send_from_directory('./', "closed_applications.xlsx")


@app.route("/Download/refused", methods=["POST"])
def download_refused():
    global is_refused_application_file

    data = request.json
    if list(data.keys()) == ["token"]:
        log(3, "Invalid request data")
        return dumps(None)

    check = admins_table.check_access(data["token"])

    if check != 1:
        if check == -1:
            log(3, "Token failed verification")
        else:
            log(2, "Token does not have access")
        return dumps(None)

    if not is_refused_application_file:
        applications = history_table.get_refused_applications()
        applications = list(map(lambda x: x + (clients_table.get(x[1])[1],), applications))
        data_for_excel = {
            "id": [],
            "client_id": [],
            "client_name": [],
            "name_of_program": [],
            "country": [],
            "status": [],
            "type": [],
            "departure_date": [],
            "user_commit": [],
            "cause": [],
            "brief": []
        }

        for application in applications:
            data_for_excel["id"].append(application[0])
            data_for_excel["client_id"].append(application[1])
            data_for_excel["name_of_program"].append(application[2])
            data_for_excel["country"].append(application[3])
            data_for_excel["status"].append(application[4])
            data_for_excel["type"].append(application[5])
            data_for_excel["departure_date"].append(application[6])
            data_for_excel["user_commit"].append(application[7])
            data_for_excel["cause"].append(application[8])
            data_for_excel["brief"].append(application[9])
            data_for_excel["client_name"].append(clients_table.get(application[1])[1])

        df = DataFrame(data_for_excel)
        writer = ExcelWriter("refused_applications.xlsx")
        df.to_excel(writer, "Refused", index=False)
        writer.save()
        is_refused_application_file = True

    log(1, "Refused file sent")
    send_from_directory('./', "refused_applications.xlsx")


# TODO: сделать удаление токенов
@app.route("/Exit", methods=["POST"])
def end():
    pass


if __name__ == "__main__":
    # TODO: logging
    # console_handler = logging.StreamHandler()
    # file_handler = logging.FileHandler(".log.txt")
    is_closed_application_file = False
    is_refused_application_file = False
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
