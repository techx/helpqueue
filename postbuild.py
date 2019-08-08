import os
import base64

print("HEROKU PUSH")
print("******* WARNING *********")
print("******* Heroku Post Build is current disabled *********")
should_run_post_build = False

if should_run_post_build:
    f = open("service_account.json", "wb")
    f.write(base64.b64decode(os.environ['GSHEETS_AUTH64']))
    f.close()

    options = ["DEBUG",
               "DEVELOPMENT",
               "SECRET_KEY",
               "SQLALCHEMY_DATABASE_URI",
               "SQLALCHEMY_TRACK_MODIFICATIONS",
               "FLASK_ENV",
               "GSHEETS_ADMIN_SHEET",
               "GSHEETS_SKILLSHEET_URL_PREAPPEND",
               "GSHEETS_REFRESH_KEY",
               "REACT_APP_CALLBACKURL"
               ]

    f = open(".env", "w")
    for option in options:
        if option in os.environ:
            f.write(f"{option}=\"{os.environ[option]}\"\n")
    f.close()
