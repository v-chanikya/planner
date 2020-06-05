import React from 'react'
import {IonGrid, IonRow, IonCol, IonSplitPane} from '@ionic/react'
import {IonList, IonItem, IonLabel, IonInput, IonDatetime, IonText, IonItemDivider, IonButton, IonTextarea} from '@ionic/react'
import {IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonIcon} from '@ionic/react'
import {add, chevronForward, chevronBack, caretForward} from 'ionicons/icons'
/* Ionic css styles */
import '@ionic/core/css/core.css'
import '@ionic/core/css/ionic.bundle.css'

class AddTask extends React.Component{
    render(){
        return(
            <div>
                <IonText color="medium">
                    <h3>Add Task</h3>
                    <p>Parent</p>
                </IonText>
                <IonList>
                    <IonItem>
                        <IonLabel position="stacked">Task</IonLabel>
                        <IonInput required type="text"></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Description</IonLabel>
                        <IonTextarea required type="text"></IonTextarea>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Deadline</IonLabel>
                        <IonDatetime placeholder="Select Date"></IonDatetime>
                    </IonItem>
                </IonList>
                <IonButton color="medium" expand="block">Add Task</IonButton>
            </div>
        )
    }
}

class Task extends React.Component{
    render(){
        return (
            <IonCard>
                <IonRow>
                    <IonCol size="8">
                        <IonCardHeader>
                            <IonCardTitle>{this.props.task_data.title}</IonCardTitle>
                            <IonCardSubtitle>Task name</IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent>Task description</IonCardContent>
                    </IonCol>
                    <IonCol size="2">
                        <IonList lines="none" className="ion-text-center">
                            <IonItem >
                                <IonIcon icon={chevronForward} size="small"/>
                            </IonItem>
                            <IonItem>
                                <IonIcon icon={add} size="small"/>
                            </IonItem>
                        </IonList>
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
                    <IonCol size="2">
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
                                supertasks={this.props.supertasks}/>
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
        return this.gettasks("/api/getChildren", task_id, pane_no, "child");
    }
    getsiblingtasks(task_id, pane_no){
        return this.gettasks("/api/getSiblings", task_id, pane_no, "sibling");
    }
    componentDidMount(){
        this.getchildtasks(0,0);
    }

    render(){
        return (
            <IonSplitPane contentId="pane1" when="xl">
                <div contentId="pane1">
                    <TasksList
                        tasks={this.state.panestack[3].tasks}
                        subtasks={task_id=>this.getchildtasks(task_id,3)}
                        supertasks={task_id=>this.getsiblingtasks(task_id,3)} />
                </div>
                <div id="pane1">
                    <IonSplitPane contentId="pane2" when="lg">
                        <div contentId="pane2">
                            <TasksList
                                tasks={this.state.panestack[2].tasks}
                                subtasks={task_id=>this.getchildtasks(task_id,2)}
                                supertasks={task_id=>this.getsiblingtasks(task_id,2)} />
                        </div>
                        <div id="pane2">
                            <IonSplitPane contentId="pane3" when="md">
                                <div contentId="pane3">
                                    <TasksList
                                        tasks={this.state.panestack[1].tasks}
                                        subtasks={task_id=>this.getchildtasks(task_id,1)}
                                        supertasks={task_id=>this.getsiblingtasks(task_id,1)} />
                                </div>
                                <div id="pane3">
                                    <TasksList
                                        tasks={this.state.panestack[0].tasks}
                                        subtasks={task_id=>this.getchildtasks(task_id,0)}
                                        supertasks={task_id=>this.getsiblingtasks(task_id,0)} />
                                </div>
                            </IonSplitPane>
                        </div>
                    </IonSplitPane>
                </div>
            </IonSplitPane>
        )
    }
}

export default Tasks
