import json
import jsonschema
import argparse

from db import load_tasks_from_file, save_to_file
from Task import ROOT_DATA
from webapp import app

DATA_FILE = "planner/tasks.json"
SCHEMA_FILE = "planner/schema.json"

def main():
    # Load tasks from file
    ROOT_DATA.base_task, ROOT_DATA.last_task_id = load_tasks_from_file(SCHEMA_FILE, DATA_FILE)

    # start the webapp
    app.run(debug=True, host="0.0.0.0", port=80)

    # Save tasks to file
    save_to_file(ROOT_DATA.base_task, DATA_FILE)

if __name__ == "__main__":
    main()

