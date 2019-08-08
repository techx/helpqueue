from flask import Flask
from flask_dotenv import DotEnv

print("Initializing Backend")
app = Flask(__name__, static_folder='build')

env = DotEnv(app)

if app.config["DEBUG"]:
    app.debug = True
else:
    app.debug = False

# Routes for heroku push
@app.route('/')
def root():
    return app.send_static_file('index.html')


@app.route('/<path:path>')
def static_proxy(path):
    """
    First we attempt to see if a static file exists, otherwise we let the react
    client do the routing.
    """
    try:
        return app.send_static_file(path)
    except:
        return app.send_static_file('index.html')
