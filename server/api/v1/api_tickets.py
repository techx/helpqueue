from flask_restful import Resource, reqparse
from server.controllers.tickets import *
from server.controllers.users import *
from server.api.v1 import return_failure, return_success, require_login
from typing import cast

CREATE_PARSER = reqparse.RequestParser(bundle_errors=True)
CREATE_PARSER.add_argument('data',
                           help='Needs data',
                           required=True)


class TicketCreate(Resource):
    def get(self):
        return return_failure("Please use post requests")

    @require_login(CREATE_PARSER)
    def post(self, data, user):
      ticket = create_ticket(user, data['data'])
      if (ticket is None):
        return return_failure("could not create ticket")
      return return_success({'ticket':ticket.json()})


TICKET_PARSER = reqparse.RequestParser(bundle_errors=True)
TICKET_PARSER.add_argument('ticket_id',
                           help='Need ticket',
                           required=True)

class TicketClaim(Resource):
    def get(self):
        return return_failure("Please use post requests")

    @require_login(TICKET_PARSER)
    def post(self, data, user):
      ticket = get_ticket(data["ticket_id"])
      if ticket is None:
        return return_failure("ticket not found")
      if claim_ticket(user, ticket):
        return return_success({'ticket':ticket.json()})
      return return_failure("could not claim ticket")

class TicketUnclaim(Resource):
    def get(self):
        return return_failure("Please use post requests")

    @require_login(TICKET_PARSER)
    def post(self, data, user):
      ticket = get_ticket(data["ticket_id"])
      if ticket is None:
        return return_failure("ticket not found")
      if unclaim_ticket(user, ticket):
        return return_success({'ticket':ticket.json()})
      return return_failure("could not unclaim ticket")


class TicketClose(Resource):
    def get(self):
        return return_failure("Please use post requests")

    @require_login(TICKET_PARSER)
    def post(self, data, user):
      ticket = get_ticket(data["ticket_id"])
      if ticket is None:
        return return_failure("ticket not found")
      if close_ticket(user, ticket):
        return return_success({'ticket':ticket.json()})
      return return_failure("could not close ticket")

class TicketCancel(Resource):
    def get(self):
        return return_failure("Please use post requests")

    @require_login(TICKET_PARSER)
    def post(self, data, user):
      ticket = get_ticket(data["ticket_id"])
      if ticket is None:
        return return_failure("ticket not found")
      if cancel_ticket(user, ticket):
        return return_success({'ticket':ticket.json()})
      return return_failure("could not cancel ticket")
