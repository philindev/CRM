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

    if clients_table.get_client_id(data["name"], data["dateOfBirth"]):
        return jsonify("Client already exist")

    clients_table.insert(data["name"], data["dateOfBirth"], data["number"], data["mail"])
    client_id = clients_table.get_client_id(data["name"], data["dateOfBirth"])
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


if __name__ == "__main__":
    db = DB(''.join(choices(ascii_letters + digits, k=16)))
    clients_table = ClientsTable(db.get_connection())
    parents_table = ParentsTable(db.get_connection())
    clients_table.init_table()
    parents_table.init_table()

    app.run(port=8000, host="127.0.0.1")

