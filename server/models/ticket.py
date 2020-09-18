from server.helpers import random_id_string
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from server.models import Base
import datetime
import secrets
import json


class Ticket(Base):
    __tablename__ = "tickets"
    id = Column(Integer, primary_key=True,
                unique=True, autoincrement=True)

    # Person requesting the ticket
    requestor_id = Column(Integer, ForeignKey('users.id'))
    requestor = relationship("User", foreign_keys=[requestor_id])

    # Person claiming the ticket (must be mentor)
    claimant_id = Column(Integer, ForeignKey('users.id'))
    claimant = relationship("User", foreign_keys=[claimant_id])

    # The data in the request
    data = Column(String, default="\{\}")

    # Random unique link
    uid = Column(String, default="no location")

    # 0 = created, 1 = claimed, 2 = unclaimed, 3 = closed, 4 = canceled, 5 = closed AND rated
    status = Column(Integer, default=0)

    # The total amount of seconds time the ticket was claimed for
    total_claimed_seconds = Column(Integer, default=0)

    # The total amount of seconds time the ticket was unclaimed for
    total_unclaimed_seconds = Column(Integer, default=0)

    # Rating given by claimant after ticket is closed
    rating = Column(Integer, default=0)

    date_created = Column(DateTime, default=datetime.datetime.now)
    date_updated = Column(DateTime, default=datetime.datetime.now)

    def __init__(self, user, data):
        """Initializes a ticket object

        Arguments:
            user {User} -- the user requesting the ticket
            data {string} -- the data of the ticket as a string
        """
        self.requestor = user
        self.data = data
        self.uid = random_id_string(stringLength=12)

    def json(self):
        """Returns JSON of the ticket object

        Returns:
            JSON -- a dictionary of string: string pairings
        """
        now = datetime.datetime.now()
        return {
            "id": self.id,
            "data": json.loads(self.data),
            "uid": self.uid,
            "status": self.status,
            "requested_by": self.requestor.name,
            "claimed_by": self.claimant.name if self.claimant else "",
            "minutes": (now-self.date_created).total_seconds()//60
        }
