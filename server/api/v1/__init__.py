from functools import wraps
from server.controllers.authentication import authenticate

def add_token(parser):
    """
    Adds the requirement for the parser to require tokens
    """
    parser.add_argument('uid',
                        type=str,
                        help='UID',
                        required=True)
    parser.add_argument('token',
                        type=str,
                        help='Token',
                        required=True)

def require_login(parser):
    """
    Forces token to be valid in order to use a specific API request
    """
    add_token(parser)

    def wrapper(func):
        @wraps(func)
        # Do something before
        def inner(self):
            data = parser.parse_args()
            user = verify_token(data)
            if (user is None):
                return return_failure("could not verify token")
            value = func(self, data, user)
            return value
        return inner
    return wrapper


def verify_token(data):
    """
    Returns None or User if the user has been authenticaed
    """
    if (any([x not in data for x in ["token", "uid"]])):
        return None
    _, user = authenticate(data['uid'], data['token'])
    return user


def return_auth_failure():
    return return_failure("could not verify token")


def return_failure(message, error_code=500):
    """
        Generates JSON for a failed API request
    """
    return {"success": False, "error": message, "error_code": error_code}

def return_success(data=None):
    """
        Generates JSON for a successful API request
    """
    if data is None:
        return {"success": True}
    return {"success": True, **data}
