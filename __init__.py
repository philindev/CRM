from flask import Flask, request, render_template, jsonify

app = Flask(__name__, template_folder="./frontend", static_folder="./frontend")


@app.route('/', methods=["GET"])
def main_page():
    return render_template("index.html")


@app.route("/UserData", methods=["POST"])
def user_data():
    data = request.json
    print(data)
    return jsonify("result")


if __name__ == "__main__":
    app.run(port=8000, host="127.0.0.1")

