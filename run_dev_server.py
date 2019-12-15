#!/usr/bin/env python
"""
Runs the backend server
"""

from flask import Flask
from server.app import app

app.config["APP-DEV"] = True

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=app.config['PORT'])
