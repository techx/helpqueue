import os
import base64
import os.path
from os import path
import os
import base64
print("Post BUILD ENV sync")

if not path.exists(".env"):
    print("******* Post build sync started *********")
    # f = open(".env", "w")
    # for key in os.environ:
    #     f.write(f"{key}=\"{os.environ[key]}\"\n")

    # if('GSHEETS_AUTH64' in os.environ):
    #     print("Copying over GSHEETS_AUTH64 as well")
    #     f = open("service_account.json", "wb")
    #     f.write(base64.b64decode(os.environ['GSHEETS_AUTH64']))
    # f.close()
else:
    print("******* WARNING *********")
    print("******* Heroku Post Build is current disabled *********")

from server.controllers.settings import *

print("******* setting settings *********")
set_setting(None, SETTING_MENTOR_PASSWORD, "cowsgomoo", override=True)
for setting in ALLDEFAULTSETTINGS:
  if (get_setting(None,setting, True) is None):
    set_setting(None, setting, "Blueprint 2022", override=True)

if (get_setting(None, SETTING_OFFICIAL_MESSAGE, True) is None):
  set_setting(None, SETTING_OFFICIAL_MESSAGE, "", override=True)
if (get_setting(None, SETTING_QUEUE_ON, True) is None):
  set_setting(None, SETTING_QUEUE_ON, True, override=True)

