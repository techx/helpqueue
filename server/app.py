from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_dotenv import DotEnv
import os

print("Initializing Backend")
app = Flask(__name__, static_folder='build')

env = DotEnv(app)
env.init_app(app, env_file="./.env", verbose_mode=True)

# Database (uncomment if needed)
db = SQLAlchemy(app)

# For heroku launching
if "DATABASE_URL" in os.environ:
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

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
