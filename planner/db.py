import jsonschema
import json
import os

from Task import ROOT_DATA, Task, find_task_algo
from utils import printer
from conf import conf

def get_all_tasks(base_task:Task, tasks:list):
    """
    Iterate through all the Task objects and create a list
    """
    for task in base_task.children:
        tasks.append(task.task)
        get_all_tasks(task, tasks)

def save_to_file(base_task:Task, planned_tasks, data_file:str):
    """
    Save all tasks to files
    """
    tasks=[]
    get_all_tasks(base_task, tasks)
    jdata = {
                "tasks":tasks,
                "today":planned_tasks["today"],
                "week":planned_tasks["week"]
            }
    pwd = os.path.dirname(os.path.realpath(__file__))
    with open(pwd + "/" + data_file, "w") as tasks_file:
        tasks_file.write(json.dumps(jdata, indent=4))

def load_tasks_from_file(schema_file:str, data_file:str) -> Task:
    """
    Load tasks data and validate it.
    Then construct the tree structure from the loaded data
    """
    pwd = os.path.dirname(os.path.realpath(__file__))

    with open(pwd + "/" + schema_file, "r") as schema_file:
        tasks_schema = json.loads(schema_file.read())
    with open(pwd + "/" + data_file, "r") as tasks_file:
        tasks = json.loads(tasks_file.read()) 
    jsonschema.validate(tasks, tasks_schema)

    # Planned tasks list
    planned_tasks = {
                "today": tasks["today"],
                "today_tasks": [],
                "week": tasks["week"],
                "week_tasks": []
            }

    # Sort the tasks for tree construction
    tasks["tasks"].sort(key=lambda x : x.get("task_id"))

    # Create a base task object
    base_task = Task(0, None, {"title":"Root","desc":"Main task"})

    # Running task
    running_task_id = None

    # Add tasks iteratively 
    for task in tasks["tasks"]:
        if "status" in task and task["status"] == "running":
            running_task_id = task["task_id"]
        new_task = Task(task["task_id"], task["parent_id"], task)
        # Construct tree
        parent = find_task_algo(base_task, task["parent_id"])
        if parent is not None:
            parent.children.append(new_task)
        # Add tasks to planned list
        if task["task_id"] in planned_tasks["today"]:
            planned_tasks["today_tasks"].append(new_task)
        if task["task_id"] in planned_tasks["week"]:
            planned_tasks["week_tasks"].append(new_task)

    return base_task, planned_tasks, tasks["tasks"][-1]["task_id"], running_task_id

def load_db():
    ROOT_DATA.base_task, ROOT_DATA.planned_task, ROOT_DATA.last_task_id, ROOT_DATA.running_task_id = load_tasks_from_file(conf.schema_file, conf.data_file)

def save_db():
    save_to_file(ROOT_DATA.base_task, ROOT_DATA.planned_task, conf.data_file)

def db_ops(func):
    def ops(*args, **kwargs):
        if conf.operation_mode  is "production":
            load_db()
            ret_val = func(*args, **kwargs)
            save_db()
            return ret_val
        else:
            return func(*args, **kwargs)
    return ops
