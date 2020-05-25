class ROOT_DATA():
    base_task = None
    last_task_id = 0


class Task(object):
    
    def __init__(self, task_id, parent_id, task):
        self.task_id = task_id
        self.parent_id = parent_id
        self.task = task
        self.children = []

    def __str__(self):
        return str(self.task_id) + "\n" + self.task["title"] + "\n" + self.task["desc"] + "\n"

def create_task(parent_id, title, desc):
    parent = find_task(ROOT_DATA.base_task, parent_id)
    if parent is None:
        print("Parent Task is not defined")
    else:
        task_id = ROOT_DATA.last_task_id + 1
        task = {
                "title":title,
                "desc":desc,
                "parent_id":parent_id,
                "task_id":task_id
                }
        parent.children.append(Task(task_id, parent_id, task))
        ROOT_DATA.last_task_id = task_id

def start_task():
    pass

def stop_task():
    pass

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
            return find_task(task, task_id)
    return None
