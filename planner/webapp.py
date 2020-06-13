from flask import Flask, render_template
from flask_restful import Resource, Api, reqparse
from Task import ROOT_DATA, find_task, create_task, toggle_task

app = Flask("planner", static_folder="webapp/build/static", template_folder="webapp/build")
api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument("task_id",type=int)

class TaskChildrenAPI(Resource):
    def post(self):
        args = parser.parse_args()
        tasks = find_task(ROOT_DATA.base_task, args['task_id'])
        if tasks is not None:
            return [task.task for task in tasks.children]
        else:
            return [] 

class TaskSiblingAPI(Resource):
    def post(self):
        args = parser.parse_args()
        tasks = find_task(ROOT_DATA.base_task, args['task_id'])
        if tasks is not None:
            tasks = find_task(ROOT_DATA.base_task, tasks.parent_id)
            if tasks is not None:
                return [task.task for task in tasks.children]
        return [] 

taskaddparser = reqparse.RequestParser()
taskaddparser.add_argument("task_name",type=str)
taskaddparser.add_argument("task_desc",type=str)
taskaddparser.add_argument("deadline",type=str)
taskaddparser.add_argument("parent_id",type=int)

class TaskAddAPI(Resource):
    def post(self):
        args = taskaddparser.parse_args()
        add_params = {"deadline_data":args["deadline"]}
        if create_task(args["parent_id"], args["task_name"], args["task_desc"], add_params=add_params):
            return {"status":"Added task successfully"}
        else:
            return {"status":"Failed to add task"}

tasktoggleparser = reqparse.RequestParser()
tasktoggleparser.add_argument("task_id", type=int)
tasktoggleparser.add_argument("time", type=str, default=None)
class TaskToggleAPI(Resource):
    def post(self):
        args = tasktoggleparser.parse_args()
        toggle_task(args["task_id"],args["time"])
        return {"status":"success"}

class TempAPI(Resource):
    def post(self):
        return {"status":"success"}

api.add_resource(TaskChildrenAPI, '/api/getChildren')
api.add_resource(TaskSiblingAPI, '/api/getSiblings')
api.add_resource(TaskAddAPI, '/api/addTask')
api.add_resource(TaskToggleAPI, '/api/toggleTaskState')

@app.route("/",defaults={'path':''})
@app.route("/<path:path>")
def index_page(path):
    return render_template("index.html")
