import json
import jsonschema
import argparse

from planner.db import load_tasks_from_file, save_to_file
from planner.Task import ROOT_DATA

def main():
    # Load tasks from file
    ROOT_DATA.base_task, ROOT_TASK.last_task_id = load_tasks_from_file

    # Save tasks to file
    save_to_file(ROOT_DATA.base_task)

if __name__ == "__main__":
    main()

