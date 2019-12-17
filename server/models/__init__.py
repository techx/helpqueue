from sqlalchemy import Table, Integer, Column, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from server.app import db

Base = db.Model
