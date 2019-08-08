from flask import Blueprint, request, Response
from flask_restful import Api, Resource, reqparse
from server.app import app
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
