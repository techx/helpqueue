import os
import base64
import os.path
from os import path
import os
import base64
print("Post BUILD ENV sync")

if not path.exists(".env"):
    print("******* Post build sync started *********")
    f = open(".env", "w")
    for key in os.environ:
        f.write(f"{key}=\"{os.environ[key]}\"\n")

    if('GSHEETS_AUTH64' in os.environ):
        print("Copying over GSHEETS_AUTH64 as well")
        f = open("service_account.json", "wb")
        f.write(base64.b64decode(os.environ['GSHEETS_AUTH64']))
    f.close()
else:
    print("******* WARNING *********")
    print("******* Heroku Post Build is current disabled *********")
