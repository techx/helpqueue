from server.models.ticket import Ticket
from server.models.user import User
from server.app import db
from server.server_constants import *
from server.controllers.settings import *
from typing import cast
import datetime
from sqlalchemy import or_, and_
from server.cache import should_cache_function

def laplaceSmooth(totalRating, totalRatings):
    alpha = 6 # was 6
    beta  = 2
    return ((totalRating + alpha)/(totalRatings + beta))

# Mentor rankings update every 60 seconds
@should_cache_function("mentor_rankings", 60)
def mentor_rankings():
    users = User.query.filter_by(mentor_is=True)
    ret = []
    len_leaderboard = 10
    for user in users:
        tickets = Ticket.query.filter_by(claimant=user, status=5)
        totalRatings = 0
        totalRating = 0
        totalUnrated = 0
        for ticket in tickets:
            if (ticket.rating > 0):
                totalRating += ticket.rating
                totalRatings += 1
            else:
                totalUnrated += 1
        unrated_tickets = Ticket.query.filter_by(claimant=user, status=3).all()
        totalUnrated += len(unrated_tickets)

        if (totalRatings > 0):
            ret.append({"name": user.name, "rating": float("{:.1f}".format(
                totalRating/totalRatings)), "tickets": totalRatings + totalUnrated, "smooth_rating": laplaceSmooth(totalRating, totalRatings)})

    # return sorted(ret, key=(lambda x: -x["smooth_rating"]))
    # sort first by rating, then by number of tickets
    return sorted(ret, key=(lambda x: (-x["rating"], -x["tickets"])))[:len_leaderboard]

def get_all_users(user, override=False):
    """
    Gets all users
    """
    if not override and not user.admin_is:
        return []
    return User.query.all()


def set_mentor(admin_user, user, value, override=False):
    # You have to be admin
    if not override and not admin_user.admin_is:
        return False
    user.mentor_is = value
    db.session.commit()
    return True


def set_admin(admin_user, user, value, override=False):
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


def delete_users_and_tickets(user):
    """Deletes all non-admin users and tickets

    Arguments:
        user {User} -- admin user

    Returns:
        True if successful
    """
    if (not user.admin_is):
        return False

    for ticket in Ticket.query.all():
        db.session.delete(ticket)
    for user in User.query.all():
        if not user.admin_is:
            db.session.delete(user)
    db.session.commit()
    return True


def user_get_ticket(user):
    """Gets the first ticket a user has requested and has not been successfully closed
    (either canceled or closed and rated)

    Arguments:
        user {User}

    Returns:
        Ticket or None
    """

    # Getting current ticket
    query = Ticket.query.filter(
        and_(Ticket.requestor == user, Ticket.status < 4))
    if (query.count() > 0):
        return query.first()
    # No current ticket
    return None


def user_get_claim_ticket(user):
    """Gets the first ticket that a user has already claimed

    Arguments:
        user {User}

    Returns:
        Ticket or None
    """
    # Getting current ticket
    query = Ticket.query.filter(
        and_(Ticket.claimant == user, Ticket.status < 3))
    if (query.count() > 0):
        return query.first()
    # No current ticket
    return None
