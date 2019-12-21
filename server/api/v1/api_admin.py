from flask_restful import Resource, reqparse
from server.controllers.settings import *
from server.controllers.users import *
from server.api.v1 import return_failure, return_success, require_login
from typing import cast
import json

GET_PARSER = reqparse.RequestParser(bundle_errors=True)

class AdminGetSettings(Resource):
    def get(self):
        return return_failure("Please use post requests")

    @require_login(GET_PARSER)
    def post(self, data, user):
        settings = get_all_settings(user)
        users = get_all_users(user)
        if (settings is None):
            return return_failure("no admin privileges")
        return return_success({
            'settings': {s.key:s.value for s in settings},
            'users': [u.json() for u in users]
        })


class AdminReset(Resource):
    def get(self):
        return return_failure("Please use post requests")

    @require_login(GET_PARSER)
    def post(self, data, user):
        if (not user.admin_is):
            return return_failure("no admin privileges")
        delete_users_and_tickets(user)
        return return_success({})


UPDATE_PARSER = reqparse.RequestParser(bundle_errors=True)
UPDATE_PARSER.add_argument('data', help='data required', required=True)

class AdminUpdate(Resource):
    def get(self):
        return return_failure("Please use post requests")

    @require_login(UPDATE_PARSER)
    def post(self, data, user):
        if (not user.admin_is):
            return return_failure("no admin privileges")
        users = get_all_users(user)
        settings = json.loads(data['data'])
        for key in settings:
            set_setting(user, key, settings[key])
        settings = get_all_settings(user)
        return return_success({
            'settings': {s.key:s.value for s in settings},
            'users': [u.json() for u in users]
        })

PROMOTE_PARSER = reqparse.RequestParser(bundle_errors=True)
PROMOTE_PARSER.add_argument('user_id', help='user_id required', required=True)
PROMOTE_PARSER.add_argument('type', help='type required', required=True)
PROMOTE_PARSER.add_argument('value', help='value required', required=True)

class AdminPromote(Resource):
    def get(self):
        return return_failure("Please use post requests")

    @require_login(PROMOTE_PARSER)
    def post(self, data, user):
        theuser = User.query.filter_by(id=data['user_id']).first()
        if (theuser is None):
            return return_failure("something went wrong")
        if data['type'] == "mentor":
            set_mentor(user, theuser, data['value'] == '1')
        elif data['type'] == "admin":
            set_admin(user, theuser, data['value'] == '1')

        settings = get_all_settings(user)
        users = get_all_users(user)

        return return_success({
            'settings': {s.key:s.value for s in settings},
            'users': [u.json() for u in users]
        })