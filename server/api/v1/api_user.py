from flask_restful import Resource, reqparse
from server.controllers.tickets import *
from server.controllers.users import *
from server.api.v1 import return_failure, return_success, require_login

USER_PARSER = reqparse.RequestParser(bundle_errors=True)

class UserRetrieveUser(Resource):
    def get(self):
        return return_failure("Please use post requests")

    @require_login(USER_PARSER)
    def post(self, data, user):
      ticket = user_get_ticket(user)
      tickets = get_claimable_tickets(user, override=True)
      total_tickets = len(tickets) if tickets is not None else 0
      current_position = total_tickets
      for i, t in enumerate(tickets):
        if t == ticket:
          current_position = i
          break
      return return_success({
        'ticket' : ticket.json() if ticket is not None else None, 
        'queue_position': current_position,
        'queue_length': total_tickets,
        'user': user.json()
      })

class UserRetrieveAdmin(Resource):
    def get(self):
        return return_failure("Please use post requests")

    @require_login(USER_PARSER)
    def post(self, data, user):
      ticket = user_get_ticket(user)
      tickets = get_claimable_tickets(user)
      total_tickets = len(tickets) if tickets is not None else 0
      return return_success({
        'ticket' : ticket.json() if ticket is not None else None, 
        'tickets' : [t.json() for t in tickets],
        'queue_length': total_tickets,
        'user': user.json()
      })


USER_UPDATE_PARSER = reqparse.RequestParser(bundle_errors=True)
USER_UPDATE_PARSER.add_argument('name',
                           help='Need name',
                           required=True)
USER_UPDATE_PARSER.add_argument('affiliation',
                           help='Needs affiliation',
                           required=True)
USER_UPDATE_PARSER.add_argument('skills',
                           help='Need skills',
                           required=True)

class UserProfileUpdate(Resource):
    @require_login(USER_UPDATE_PARSER)
    def post(self, data, user):
      set_name(user, data['name'])
      set_affiliation(user, data['affiliation'])
      set_skills(user, data['skills'])
      return return_success({
        'user': user.json()
      })
  
  