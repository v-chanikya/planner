import React from 'react'
import {IonGrid, IonRow, IonCol, IonSplitPane} from '@ionic/react'
import {IonList, IonItem, IonLabel, IonInput, IonDatetime, IonText, IonItemDivider, IonButton, IonTextarea} from '@ionic/react'
import {IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonIcon} from '@ionic/react'
import {add, chevronForward, chevronBack, caretForward} from 'ionicons/icons'
/* Ionic css styles */
import '@ionic/core/css/core.css'
import '@ionic/core/css/ionic.bundle.css'

import './Tasks.css'

class AddTask extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            "task_name":"",
            "task_desc":"",
            "deadline":"",
            "parent_id":this.props.parentid
        };
        this.update = this.update.bind(this);
    }
    update(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        })
    }
    addTask(){
        fetch("/api/addTask", {
            method: 'POST',
            headers: {
                'Content-Type':'application/json;charset=utf-8'
            },
            body: JSON.stringify(this.state)
        })
        .then(response=> response.json())
        .then(data=>{
            console.log(data);
            this.props.newtaskpane(this.props.parentid, false);
        });
    }
    render(){
        return(
            <div>
                <IonText color="medium">
                    <h3>Add Task</h3>
                    <p>{this.props.parentid}</p>
                </IonText>
                <IonList>
                    <IonItem>
                        <IonLabel position="stacked">Task</IonLabel>
                        <IonInput required type="text" name="task_name" onIonChange={this.update}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Description</IonLabel>
                        <IonTextarea required type="text" name="task_desc" onIonChange={this.update}></IonTextarea>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Deadline</IonLabel>
                        <IonDatetime placeholder="Select Date" max="2025" name="deadline" onIonChange={this.update}></IonDatetime>
                    </IonItem>
                </IonList>
                <IonButton color="medium" expand="block" onClick={()=>this.addTask()}>Add Task</IonButton>
            </div>
        )
    }
}

class Task extends React.Component{
    render(){
        return (
            <IonCard>
                <IonRow>
                    <IonCol>
                        <IonCardHeader>
                            <IonCardTitle>{this.props.task_data.title}</IonCardTitle>
                            <IonCardSubtitle>Task name</IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent>Task description</IonCardContent>
                    </IonCol>
                </IonRow>
                <hr/>
                <IonRow className="ion-text-center">
                    <IonCol size="2" className="ion-text-left" onClick={() => this.props.supertasks(this.props.task_data.parent_id)}>
                        <IonIcon icon={chevronBack} size="small"/>
                    </IonCol>
                    <IonCol size="2">
                        <IonIcon icon={caretForward} size="small" color="green"/>
                    </IonCol>
                    <IonCol size="4">
                        <IonText>00:00:00</IonText>
                    </IonCol>
                    <IonCol size="2" onClick={()=>this.props.newtaskpane(this.props.task_data.task_id,true)}>
                        <IonIcon icon={add} size="small"/>
                    </IonCol>
                    <IonCol size="2" className="ion-text-right" onClick={() => this.props.subtasks(this.props.task_data.task_id)}>
                        <IonIcon icon={chevronForward} size="small"/>
                    </IonCol>
                </IonRow>
            </IonCard>
        )
    }
}

class TasksList extends React.Component{
        render(){
        const tasks = this.props.tasks;
        return (
                    <div style={{width:"100%"}}>
                        {tasks.map(task=>(
                            <Task
                                task_data={task}
                                subtasks={this.props.subtasks}
                                supertasks={this.props.supertasks}
                                newtaskpane={this.props.newtaskpane}/>
                        ))}
                    </div>
            )
    }
}

class Tasks extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            panestack: [
                {"tasks":[]},
                {"tasks":[]},
                {"tasks":[]},
                {"tasks":[]}
            ]
        }
        this.action_state = "task"
    }
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
                var task_pane = [{"tasks":data}];
                var task_panes = this.state.panestack.slice();
                if(req_type === "child"){
                    task_panes = task_pane.concat(task_panes.slice(pane_no,4));
                    for(i=0; pane_no > 0 && i < (3-(4-pane_no)); i++){
                        task_panes.push({"tasks":[]});
                    }
                    this.setState({"panestack":task_panes});
                } else if(req_type === "sibling"){
                    task_panes.shift();
                    task_panes.concat(task_pane);
                    for(i=0; i < 4 - task_panes.length; i++){
                        task_panes.push({"tasks":[]});
                    }
                    this.setState({"panestack":task_panes});
                }
            }
            return;
        });
    }
    getchildtasks(task_id, pane_no){
        if(this.action_state === "task")
            this.gettasks("/api/getChildren", task_id, pane_no, "child");
    }
    getsiblingtasks(task_id, pane_no){
        if(this.action_state === "task")
            this.gettasks("/api/getSiblings", task_id, pane_no, "sibling");
    }
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
    componentDidMount(){
        this.getchildtasks(0,0);
    }

    render(){
        return (
            <div>
                <div id="pane3">
                    <TasksList
                        tasks={this.state.panestack[3].tasks}
                        subtasks={task_id=>this.getchildtasks(task_id,3)}
                        supertasks={task_id=>this.getsiblingtasks(task_id,3)}
                        newtaskpane={(task_id,add)=>this.newtaskpane(task_id,add,3)}/>
                </div>
                <div id="pane2">
                    <TasksList
                        tasks={this.state.panestack[2].tasks}
                        subtasks={task_id=>this.getchildtasks(task_id,2)}
                        supertasks={task_id=>this.getsiblingtasks(task_id,2)}
                        newtaskpane={(task_id,add)=>this.newtaskpane(task_id,add,2)}/>
                </div>
                <div id="pane1">
                    <TasksList
                        tasks={this.state.panestack[1].tasks}
                        subtasks={task_id=>this.getchildtasks(task_id,1)}
                        supertasks={task_id=>this.getsiblingtasks(task_id,1)}
                        newtaskpane={(task_id,add)=>this.newtaskpane(task_id,add,1)}/>
                </div>
                <div id="pane0">
                    {this.state.panestack[0].pane_type === "add"
                    ?<AddTask
                        parentid={this.state.panestack[0].task_id}
                        newtaskpane={(task_id,add)=>this.newtaskpane(task_id,add,this.state.panestack[0].pane_no)}/>
                    :<TasksList
                        tasks={this.state.panestack[0].tasks}
                        subtasks={task_id=>this.getchildtasks(task_id,0)}
                        supertasks={task_id=>this.getsiblingtasks(task_id,0)}
                        newtaskpane={(task_id,add)=>this.newtaskpane(task_id,add,0)}/>
                    }
                </div>
            </div>
        )
    }
}

export default Tasks
