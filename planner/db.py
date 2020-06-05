import jsonschema
import json

from Task import Task, find_task
from utils import printer

def get_all_tasks(base_task:Task, tasks:list):
    """
    Iterate through all the Task objects and create a list
    """
    for task in base_task.children:
        tasks.append(task.task)
        get_all_tasks(task, tasks)

def save_to_file(base_task:Task, data_file:str):
    """
    Save all tasks to files
    """
    tasks=[]
    get_all_tasks(base_task, tasks)
    with open(data_file, "w") as tasks_file:
        tasks_file.write(json.dumps({"tasks":tasks}, indent=4))

def load_tasks_from_file(schema_file:str, data_file:str) -> Task:
    """
    Load tasks data and validate it.
    Then construct the tree structure from the loaded data
    """
    with open(schema_file, "r") as schema_file:
        tasks_schema = json.loads(schema_file.read())
    with open(data_file, "r") as tasks_file:
        tasks = json.loads(tasks_file.read()) 
    jsonschema.validate(tasks, tasks_schema)

    # Sort the tasks for tree construction
    tasks["tasks"].sort(key=lambda x : x.get("task_id"))

    # Create a base task object
    base_task = Task(0, None, {"title":"Root","desc":"Main task"})

    for task in tasks["tasks"]:
        new_task = Task(task["task_id"], task["parent_id"], task)
        parent = find_task(base_task, task["parent_id"])
        if parent is not None:
            parent.children.append(new_task)

    return base_task, tasks["tasks"][-1]["task_id"]
