from server.app import app
from server.api.v1.api import api
from flask import Flask
from flask_restful import Api
import sys
import os
from server.controllers.settings import *

app.register_blueprint(api.blueprint, url_prefix='/api/v1')

if "MASTER_EMAIL" in os.environ:
    set_setting(None, SETTING_MASTER_USER, os.environ["MASTER_EMAIL"], override=True)

if "REACT_APP_SITEURL" in os.environ:
    app.config["REACT_APP_SITEURL"] = os.environ["REACT_APP_SITEURL"]

set_setting(None, SETTING_URL, app.config["REACT_APP_SITEURL"], override=True)