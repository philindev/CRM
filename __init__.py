from flask import Flask, request, render_template
from json import dumps
from string import ascii_letters, digits
from random import choices
from database import *

app = Flask(__name__, template_folder="./frontend", static_folder="./frontend")


@app.route('/', methods=["GET"])
def main_page():
    return render_template("index.html")


@app.route("/UserData", methods=["POST"])
def user_data():
    data = request.json

    if list(data.keys()) != ['name', 'status', 'date_of_birth', 'number', 'mail', 'firstParent', 'secondParent']:
        return dumps(None)

    client_id = clients_table.get_client_id(data["name"], data["date_of_birth"])
    if client_id:
        return dumps(client_id[0])

    first_parent = data["firstParent"]
    second_parent = data["secondParent"]

    if not (first_parent or second_parent):
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
        return dumps(None)

    clients_table.insert(data["name"], data["date_of_birth"], data["number"], data["mail"],
                         1 if data["status"] == "V.I.P." else
                         2 if data["status"] == "Новый" else
                         3 if data["status"] == "Повторный" else 0)

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
    # token = "generating_token"
    return dumps(client_id)


@app.route("/UserRequest", methods=["POST"])
def user_request():
    data = request.json

    if list(data.keys()) != ["client_id", "name_of_program", "status", "country",
                             "where_from", "data_of_will_fly", "comment", "type_of_program"]:
        return dumps(None)

    client_id = data["client_id"]

    if not clients_table.get(client_id):
        return dumps(None)

    if current_requests_table.get(client_id):
        return dumps(None)

    current_requests_table.insert(client_id, data["name_of_program"],
                                  data["country"], data["type_of_program"],
                                  data["date_of_will_fly"], data["commit"],
                                  1 if data["status"] == "Заявка" else
                                  2 if data["status"] == "Договор" else
                                  3 if data["status"] == "Оплата" else
                                  4 if data["status"] == "Вылет" else
                                  5 if data["status"] == "Консультирование" else 0)

    return dumps("I hacked your system")


@app.route("/GetInfo", methods=["GET"])
def get_client():
    def time_calculation(obj: dict):
        if obj and obj["date_of_creation"]:
            obj["date_of_creation"] = time_is_now - obj["date_of_creation"]
        return obj["date_of_creation"]

    time_is_now = time()
    response = []

    for client in map(list, clients_table.get_all()):
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
        client["date_of_creation"] = time_calculation(client)
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
            "departure_date...": current_request[6],
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

        response.append(client_data)

    return dumps(response)


if __name__ == "__main__":
    # db = DB(''.join(choices(ascii_letters + digits, k=16)))
    db = DB("database")
    clients_table = ClientsTable(db.get_connection())
    parents_table = ParentsTable(db.get_connection())
    history_table = HistoryTable(db.get_connection())
    current_requests_table = CurrentRequestsTable(db.get_connection())
    clients_table.init_table()
    parents_table.init_table()
    history_table.init_table()
    current_requests_table.init_table()

    app.run(port=8000, host="127.0.0.1")
