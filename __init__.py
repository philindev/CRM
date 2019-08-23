from flask import Flask, request, render_template, jsonify
from database import *

app = Flask(__name__, template_folder="./frontend", static_folder="./frontend")


@app.route('/', methods=["GET"])
def main_page():
    return render_template("index.html")


@app.route("/UserData", methods=["POST"])
def user_data():
    data = request.json
    clients_table.insert(data["name"], data["dateOfBirth"], data["number"], data["mail"])
    client_id = clients_table.get_client_id(data["name"])
    parents_table.insert(
        client_id[0], data["firstParent"]["name"],
        data["firstParent"]["number"], data["firstParent"]["mail"],
        data["firstParent"]["job"], data["secondParent"]["name"],
        data["secondParent"]["number"], data["secondParent"]["mail"],
        data["secondParent"]["job"]
    )
    return jsonify("it work")


if __name__ == "__main__":
    db = DB()
    clients_table = ClientsTable(db.get_connection())
    parents_table = ParentsTable(db.get_connection())
    clients_table.init_table()
    parents_table.init_table()

    app.run(port=8000, host="127.0.0.1")

