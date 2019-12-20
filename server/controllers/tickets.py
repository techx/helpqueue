from server.models.ticket import Ticket
from server.models.user import User
from server.app import db
from typing import cast
import datetime
from sqlalchemy import or_, and_

def get_claimable_tickets(user, override=False):
  if not user.mentor_is and not override:
    return []
  tickets = Ticket.query.filter(or_(Ticket.status == 0, Ticket.status == 2)).order_by(Ticket.id).all()
  return tickets

def get_ticket(ticket_id):
  ticket = Ticket.query.filter_by(
        id=ticket_id).first()
  return ticket
  
def create_ticket(user, data):
  """
  Creates ticket with a data dictionary field
  Returns ticket or None if failed
  """
  if (Ticket.query.filter(and_(Ticket.requestor==user,Ticket.status < 3)).count() > 0):
    return None
  ticket = Ticket(user, data)
  db.session.add(ticket)
  db.session.commit()
  return ticket

def claim_ticket(user, ticket):
  """
  returns true if successful
  """
  # only mentors / admins can claim
  if (not user.mentor_is and not user.admin_is):
    return False

  now = datetime.datetime.now()
  if (ticket.status == 0 or ticket.status == 2):
    # ticket is currently able to be claimed
    ticket.total_unclaimed_seconds += (now-ticket.date_updated).total_seconds()
    ticket.claimant = user
    ticket.date_updated = now
    ticket.status = 1
    db.session.commit()
    return True
  return False

def unclaim_ticket(user, ticket):
  now = datetime.datetime.now()

  # Claimant has to be same user and actually claimed (and not closed)
  if ticket.claimant != user or ticket.status != 1:
    return False

  ticket.total_claimed_seconds += (now-ticket.date_updated).total_seconds()
  ticket.claimant = None
  ticket.date_updated = now
  ticket.status = 2
  db.session.commit()
  return True

def cancel_ticket(user, ticket):
  now = datetime.datetime.now()

  # since ticket was never claimed then we don't do anything
  # You can only cancel ticket if the ticket is not already dead
  if ticket.status < 3:
    # Only the requester (or admin) can close
    if (ticket.requestor != user and not user.admin_is):
      return False
    ticket.status = 4
    ticket.date_updated = now
    db.session.commit()
    return True
  return False

def close_ticket(user, ticket):
  now = datetime.datetime.now()
  # only mentors can close
  if (not user.mentor_is and not user.admin_is):
    return False
  if (ticket.claimant == user):
    ticket.total_claimed_seconds += (now-ticket.date_updated).total_seconds()
    ticket.status = 3
    ticket.date_updated = now
    db.session.commit()
    return True
  return False
    