import datetime


class ROOT_DATA():
    base_task = None
    last_task_id = 0
    running_task_id = None


class Task(object):
    
    def __init__(self, task_id, parent_id, task):
        self.task_id = task_id
        self.parent_id = parent_id
        self.task = task
        self.children = []

    def __str__(self):
        return str(self.task_id) + "\n" + self.task["title"] + "\n" + self.task["desc"] + "\n"

def create_task(parent_id, title, desc, add_params=None):
    parent = find_task(ROOT_DATA.base_task, parent_id)
    if parent is not None:
        task_id = ROOT_DATA.last_task_id + 1
        task = {
                "title":title,
                "desc":desc,
                "parent_id":parent_id,
                "task_id":task_id
                }
        if add_params is not None:
            task.update(add_params)
        parent.children.append(Task(task_id, parent_id, task))
        ROOT_DATA.last_task_id = task_id
        return True
    return False

def toggle_task(task_id:int, time:str=None):
    task = find_task(ROOT_DATA.base_task, task_id)
    if task is not None:
        task = task.task
        if "status" in task:
            task["status"] = "running" if task["status"] == "stopped" else "stopped"
        else:
            task["status"] = "running"
        
        time = time if time != None else datetime.datetime.now().isoformat()
        
        if task["status"] is "running":
            task["start_time"] = time
            # Stop any other running task
            if ROOT_DATA.running_task_id is not None and ROOT_DATA.running_task_id is not task_id:
                running_tsk = ROOT_DATA.running_task_id
                ROOT_DATA.running_task_id = None
                toggle_task(running_tsk, time)
            ROOT_DATA.running_task_id = task_id
        else:
            task["end_time"] = time
            ROOT_DATA.running_task_id = None


def mark_complete():
    pass

# Using DFS for search
def find_task(root:Task, task_id:int) -> Task:
    if root.task_id is task_id:
        return root
    for task in root.children:
        #print(task)
        if task.task_id is task_id:
            return task
        elif len(task.children) is not 0:
            ret_task = find_task(task, task_id)
            if ret_task is not None:
                return ret_task
    return None
