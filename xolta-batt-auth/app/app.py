from flask import Flask, request
from xolta_auth import XoltaBattAuthenticator

app = Flask(__name__)


@app.route('/login', methods=['POST'])
def do_login():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json = request.json
        authenticator = XoltaBattAuthenticator()
        result = authenticator.do_login(json)
        return result
    else:
        return 'Content-Type not supported!'


if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=8000)