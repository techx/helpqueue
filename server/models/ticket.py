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

    requestor_id = Column(Integer, ForeignKey('users.id'))
    requestor = relationship("User", foreign_keys=[requestor_id])

    claimant_id = Column(Integer, ForeignKey('users.id'))
    claimant = relationship("User", foreign_keys=[claimant_id])

    data = Column(String, default="\{\}")

    # 0 = created, 1 = claimed, 2 = unclaimed, 3 = closed, 4 = canceled
    status = Column(Integer, default=0)
    total_claimed_seconds = Column(Integer, default=0)
    total_unclaimed_seconds = Column(Integer, default=0)

    date_created = Column(DateTime, default=datetime.datetime.now)
    date_updated = Column(DateTime, default=datetime.datetime.now)

    def __init__(self, user, data):
        """
        user is requestor
        data is a dictionary
        """
        self.requestor = user
        self.data = data

    def json(self):
        now = datetime.datetime.now()
        return {
            "id": self.id,
            "data": json.loads(self.data),
            "status": self.status,
            "requested_by": self.requestor.name,
            "claimed_by": self.claimant.name if self.claimant else "",
            "minutes": (now-self.date_created).total_seconds()//60
        }
