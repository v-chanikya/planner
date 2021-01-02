#! /usr/bin/python3

codebase_path = "/home/pi/planner/"

activate_this = codebase_path + "venv/bin/activate_this.py"
with open(activate_this) as file_:
    exec(file_.read(), dict(__file__=activate_this))

import sys
import logging
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0, codebase_path + "planner")

from webapp import app as application
