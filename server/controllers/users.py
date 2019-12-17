from server.models.ticket import Ticket
from server.models.user import User
from server.app import db
from server.server_constants import *
from server.controllers.settings import *
from typing import cast
import datetime
from sqlalchemy import or_, and_


def get_all_users(user, override = False):
  """
  Gets all users
  """
  if not override and not user.admin_is:
    return []
  return User.query.all()

def set_mentor(admin_user, user, value):
  # You have to be admin
  if not admin_user.admin_is:
    return False
  user.mentor_is = value
  db.session.commit()
  return True

def set_admin(admin_user, user, value, override = True):
  # You have to be admin
  if not override and not admin_user.admin_is:
    return False
  # Master admin cannot be unadmined
  if value is False and get_setting(admin_user, SETTING_MASTER_USER) == user.email:
    return False
  user.admin_is = value
  db.session.commit()
  return True

def set_name(user, name):
  user.name = name
  db.session.commit()

def set_affiliation(user, affiliation):
  user.affiliation = affiliation
  db.session.commit()

def set_skills(user, skills):
  user.skills = skills
  db.session.commit()

def user_get_ticket(user):
  # Getting current ticket
  query = Ticket.query.filter(and_(Ticket.requestor==user,Ticket.status < 3))
  if (query.count() > 0):
    return query.first()
  # No current ticket
  return None