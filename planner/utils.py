
def printer(tasks:object, space:str=""):
    print(space, tasks)
    for task in tasks.children:
        printer(task, space + "    ")
