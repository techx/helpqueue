from flask_sqlalchemy import SQLAlchemy
from flask import Flask
import os

print("Initializing Backend")
app = Flask(__name__, static_folder='build')

if "SQLALCHEMY_DATABASE_URI" in os.environ:
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["SQLALCHEMY_DATABASE_URI"]
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# For heroku launching
if "DATABASE_URL" in os.environ:
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

if "PORT" in os.environ:
    app.config["PORT"] = os.environ["PORT"]
    
# Database (uncomment if needed)
db = SQLAlchemy(app)

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
