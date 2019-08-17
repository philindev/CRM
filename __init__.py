from flask import Flask, json, request, render_template

app = Flask(__name__, template_folder="frontend", static_folder="frontend")


@app.route('/', methods=["GET"])
def main_page():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(port=8000, host="127.0.0.1")

