import requests
from server.app import app
import datetime

DOPEAUTH_CACHE_STRICT = {}
DOPEAUTH_CACHE = {}


def authenticate_with_dopeauth(email, uid, token, strictAuth=True):
    """
    StrictAuth also checks callback url for another layer of security.
    Caches keys so we don't call the server so many times

    Returns true or false!
    """
    global DOPEAUTH_CACHE
    global DOPEAUTH_CACHE_STRICT

    if (not strictAuth and uid + "___" + token in DOPEAUTH_CACHE):
        return email == DOPEAUTH_CACHE[uid + "___" + token]
    if (strictAuth and uid + "___" + token in DOPEAUTH_CACHE_STRICT):
        return email == DOPEAUTH_CACHE_STRICT[uid + "___" + token]

    if(strictAuth):
        params = {
            "email": email,
            "uid": uid,
            "token": token,
            "callback": app.config["REACT_APP_SITEURL"] + "/login/auth"
        }
    else:
        params = {
            "email": email,
            "uid": uid,
            "token": token
        }

    r = requests.post(
        url="https://dopeauth.com/api/v1/site/verify", params=params)
    data = r.json()
    success = "success" in data and data["success"]
    if (success):
        if(strictAuth):
            DOPEAUTH_CACHE_STRICT[uid + "___" + token] = email
        DOPEAUTH_CACHE[uid + "___" + token] = email
    return success
