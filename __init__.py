from flask import Flask, request, render_template, jsonify
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

    if clients_table.get_client_id(data["name"], data["date_of_birth"]):
        return jsonify("Client already exist")

    clients_table.insert(data["name"], data["date_of_birth"], data["number"], data["mail"])
    client_id = clients_table.get_client_id(data["name"], data["date_of_birth"])
    first_parent = data["firstParent"]
    second_parent = data["secondParent"]

    if first_parent and second_parent:
        parents_table.insert(
            client_id[0], first_parent["name"], first_parent["number"],
            first_parent["mail"], first_parent["job"],
            second_parent["name"], second_parent["number"],
            second_parent["mail"], second_parent["job"]
        )
        return jsonify("Success")
    else:
        return jsonify("Success, but missing parent information")


@app.route("/GetInfo", methods=["GET"])
def get_client():
    def time_calculation(obj: dict):
        if(obj["date_of_creation"]):
            obj["date_of_creation"] = time_is_now - obj["date_of_creation"]
        return obj

    time_is_now = time()
    clients = clients_table.get_all()
    response = []

    for client in clients:
        client["parent"] = parents_table.get(client["client_id"])
        client = time_calculation(client)
        current_request = current_requests_table.get(client["client_id"])
        current_request = time_calculation(current_request)
        client_data = {
            "client": client,
            "request": current_request,
            "history": map(time_calculation, history_table.get_all_client_applications(client["client_id"]))
        }
        response.append(client_data)

    return jsonify(response)


if __name__ == "__main__":
    db = DB(''.join(choices(ascii_letters + digits, k=16)))
    clients_table = ClientsTable(db.get_connection())
    parents_table = ParentsTable(db.get_connection())
    history_table = HistoryTable(db.get_connection())
    current_requests_table = CurrentRequestsTable(db.get_connection())
    clients_table.init_table()
    parents_table.init_table()
    history_table.init_table()
    current_requests_table.init_table()

    app.run(port=8000, host="127.0.0.1")
