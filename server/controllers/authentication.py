import requests
from server.app import app


def authenticateWithDopeAuth(email, uid, token, strictAuth=True):
    """
    StrictAuth also checks callback url for another layer of security.

    Returns true or false!
    """
    PARAMS = {
        "email": email,
        "id": uid,
        "token": token,
        "callback": app.config["REACT_APP_CALLBACKURL"]
    }
    r = requests.post(
        url="https://dopeauth.com/api/v1/site/verify", params=PARAMS)

    data = r.json()
    return "success" in data and data["success"]
