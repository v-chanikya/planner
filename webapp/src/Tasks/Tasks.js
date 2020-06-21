import React from 'react'
/* Ionic css styles */
import '@ionic/core/css/core.css'
import '@ionic/core/css/ionic.bundle.css'

import './Tasks.css'
import AddTask from './AddTask'
import Task from './Task'


class Tasks extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            panestack: [
                {"tasks":[], "selected":0},
                {"tasks":[], "selected":0},
                {"tasks":[], "selected":0},
                {"tasks":[], "selected":0}
            ]
        }
        this.action_state = "task";
        this.previousRunningTask = null;
    }
    componentDidMount(){
        this.getchildtasks(0,0);
    }
    /**
     ***********************
     * Invoke backend API's
     ***********************
     */
    /**
     * Get task panes
     */
    gettasks(API_path, task_id, pane_no, req_type){
        fetch(API_path, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json;charset=utf-8'
            },
            body: JSON.stringify({"task_id":task_id})
        })
        .then(response=> response.json())
        .then(data => {
            var i = 0;
            if (data.length > 0){
                var task_pane = [{"tasks":data, "selected":0}];
                var task_panes = this.state.panestack.slice();
                task_panes[pane_no].selected = task_id;
                if(req_type === "child"){
                    task_panes = task_pane.concat(task_panes.slice(pane_no,4));
                    for(i=0; pane_no > 0 && i < (3-(4-pane_no)); i++){
                        task_panes.push({"tasks":[], "selected":0});
                    }
                    this.setState({"panestack":task_panes});
                } else if(req_type === "sibling"){
                    task_panes.shift();
                    task_panes.concat(task_pane);
                    for(i=0; i < 4 - task_panes.length; i++){
                        task_panes.push({"tasks":[], "selected":0});
                    }
                    this.setState({"panestack":task_panes});
                }
            }
            return;
        });
    }
    /**
     ********************
     * View Manuplators
     ********************
     */
    getchildtasks(task_id, pane_no){
        if(this.action_state === "task"){
            this.gettasks("/api/getChildren", task_id, pane_no, "child");
        }
    }
    getsiblingtasks(task_id, pane_no){
        if(this.action_state === "task")
            this.gettasks("/api/getSiblings", task_id, pane_no, "sibling");
    }
    /**
     * Invoked from child task/new task pane
     */
    newtaskpane(task_id, add, pane_no){
        var task_panes = this.state.panestack.slice()
        if (add === true){
            if (this.action_state === "task"){
                var addpane = [{"task_id":task_id,"pane_type":"add","pane_no":pane_no}];
                task_panes = addpane.concat(task_panes);
                this.action_state = "newtask";
                this.setState({"panestack":task_panes});
            }
        }else{
            task_panes.shift();
            this.action_state = "task";
            this.setState({"panestack":task_panes});
            this.getchildtasks(task_id, pane_no);
        }
    }
    /**
     * Invoked from one task to change another tasks state
     */
    stopTimer(func){
        if (this.prevRunningTask != null){
            this.prevRunningTask();
        }
        this.prevRunningTask = func;
    }
    /**
     * Reload the task if requested by child
     * This might be invoked if some task internal state is changed
     */
    reloadTask(task_id){
        var panes = this.state.panestack.slice();
        var pane_no = null;
        var task_no = null;
        for (var pane in panes){
            for (var task in panes[pane].tasks){
                if (panes[pane].tasks[task].task_id === task_id){
                    pane_no = pane;
                    task_no = task;
                    break;
                }
            }
        }
        if (task_no != null && pane_no !=null){
            fetch("/api/getTask", {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json;charset=utf-8'
                },
                body: JSON.stringify({"task_id":task_id})
            })
            .then(response=> response.json())
            .then(data => {
                panes[pane_no].tasks[task_no] = data;
                this.setState(panes);
            })
        }
    }
    render(){
        return (
            <div>
                {this.state.panestack.map((tasks,index)=>(
                    <div id={"pane".concat(index)} key={index}>
                        {(index === 0 && tasks.pane_type === "add")
                            ?<AddTask
                                parentid={tasks.task_id}
                                newtaskpane={(task_id,add)=>this.newtaskpane(task_id,add,tasks.pane_no)}/>
                            :tasks.tasks.map((task)=>(
                                <Task
                                    key={task.task_id}
                                    stopTimer={func=>this.stopTimer(func)}
                                    task_data={task}
                                    selected={tasks.selected}
                                    reload={()=>this.reloadTask(task.task_id)}
                                    subtasks={task_id=>this.getchildtasks(task_id,index)}
                                    supertasks={task_id=>this.getsiblingtasks(task_id,index)}
                                    newtaskpane={(task_id,add)=>this.newtaskpane(task_id,add,index)}/>))
                        }
                    </div>
                ))}
            </div>
        )
    }
}

export default Tasks
