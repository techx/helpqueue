from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from server.models import Base
import datetime
import secrets


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True,
                unique=True, autoincrement=True)

    email = Column(String, unique=True, primary_key=True)
    name = Column(String)
    
    affiliation = Column(String)

    contact_info = Column(String)
    
    admin_is = Column(Boolean, default=False)
    mentor_is = Column(Boolean, default=False)

    skills = Column(String, default=";")

    clients = relationship("Client", back_populates="user")

    date_created = Column(DateTime, default=datetime.datetime.now)
    date_updated = Column(DateTime, default=datetime.datetime.now)

    def __init__(self, name, email, org=None):
        self.name = name
        self.email = email

    def json(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'admin_is': self.admin_is,
            'mentor_is': self.mentor_is,
            'skills': self.skills
        }