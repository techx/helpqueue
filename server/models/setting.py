from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from server.models import Base
import datetime
import secrets


class Setting(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True,
                unique=True, autoincrement=True)

    key = Column(String, unique=True, primary_key=True)
    value = Column(String)

    date_created = Column(DateTime, default=datetime.datetime.now)
    date_updated = Column(DateTime, default=datetime.datetime.now)

    def __init__(self, key, value):
        self.key = key
        self.value = value