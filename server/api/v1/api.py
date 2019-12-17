from flask import Blueprint, request, Response
from flask_restful import Api, Resource, reqparse
from server.app import app
from server.api.v1 import api_tickets
from server.api.v1 import api_admin
from server.api.v1 import api_login
from server.api.v1 import api_user
import json

# NOTE: all the following resources by default start with '/api/v1' so there's
# no need to specify that


class HelloWorld(Resource):
    def get(self):
        return {'success': False, 'message': "Please use post requests"}

    def post(self):
        return {'success': True}



# Blueprint for /api/v1 requests
api = Api(Blueprint('api', __name__))

# Endpoint registration
api.add_resource(HelloWorld, '')  # This would be the default hostname/api/v1
api.add_resource(api_tickets.TicketCreate, '/ticket/create')
api.add_resource(api_tickets.TicketClaim, '/ticket/claim')
api.add_resource(api_tickets.TicketUnclaim, '/ticket/unclaim')
api.add_resource(api_tickets.TicketClose, '/ticket/close')
api.add_resource(api_tickets.TicketCancel, '/ticket/cancel')

api.add_resource(api_user.UserRetrieveUser, '/user/ticket')
api.add_resource(api_user.UserRetrieveAdmin, '/user/tickets')
api.add_resource(api_user.UserProfileUpdate, '/user/update')

api.add_resource(api_admin.AdminPromote, '/admin/promote')
api.add_resource(api_admin.AdminUpdate, '/admin/update')
api.add_resource(api_admin.AdminGetSettings, '/admin/settings')

# Login
api.add_resource(api_login.ClientLogin, '/client/login')
api.add_resource(api_login.ClientSettings, '/client')