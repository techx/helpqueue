from server.app import app
from server.api.v1.api import api
from flask import Flask
from flask_restful import Api
import sys

app.register_blueprint(api.blueprint, url_prefix='/api/v1')
