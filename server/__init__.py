from dotenv import load_dotenv, find_dotenv
print(find_dotenv())
load_dotenv(dotenv_path=find_dotenv(), verbose=True)
import os
from server.app import app, db
from server.api.v1.api import api
from flask import Flask
from flask_restful import Api
from server.controllers.cron import cron_job
from apscheduler.schedulers.background import BackgroundScheduler
import sys
import os
from server.controllers.settings import *

app.register_blueprint(api.blueprint, url_prefix='/api/v1')

print("Initializing Background Scheduler")
sched = BackgroundScheduler()
sched.add_job(cron_job, trigger='interval', days=1)
sched.start()
cron_job()

try:
    if "MASTER_EMAIL" in os.environ:
        set_setting(None, SETTING_MASTER_USER, os.environ["MASTER_EMAIL"], override=True)
    if os.getenv("MASTER_EMAIL") is not None:
        set_setting(None, SETTING_MASTER_USER, os.getenv("MASTER_EMAIL"), override=True)

    if "REACT_APP_SITEURL" in os.environ:
        app.config["REACT_APP_SITEURL"] = os.environ["REACT_APP_SITEURL"]
    if os.getenv("REACT_APP_SITEURL") is not None:
        app.config["REACT_APP_SITEURL"] = os.getenv("REACT_APP_SITEURL")

    set_setting(None, SETTING_URL, app.config["REACT_APP_SITEURL"], override=True)
except:
    print("It appears as if the database is not set up")
    db.session.rollback()