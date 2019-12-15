import os
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from server.app import app, db

# This file is only necessary to be called
# You are using a database

migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
