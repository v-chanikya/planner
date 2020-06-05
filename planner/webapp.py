from flask import Flask, render_template
from flask_restful import Resource, Api, reqparse
from Task import ROOT_DATA,find_task

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

api.add_resource(TaskChildrenAPI, '/api/getChildren')
api.add_resource(TaskSiblingAPI, '/api/getSiblings')

@app.route("/",defaults={'path':''})
@app.route("/<path:path>")
def index_page(path):
    return render_template("index.html")
