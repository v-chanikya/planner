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
    constructor(props){
        super(props);
        this.state = {
            tasks : []
        }
    }
    gettasks(API_path, task_id){
        fetch(API_path, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json;charset=utf-8'
            },
            body: JSON.stringify({"task_id":task_id})
        })
        .then(response=> response.json())
        .then(data => data.length ? this.setState({"tasks":data}): true);
    }
    getchildtasks(task_id){
        return this.gettasks("/api/getChildren", task_id)
    }
    getsiblingtasks(task_id){
        return this.gettasks("/api/getSiblings", task_id);
    }
    componentDidMount(){
        this.getchildtasks(0);
    }
    render(){
        const tasks = this.state.tasks;
        return (
            <IonGrid>
                <IonRow>
                    <IonCol size="12" sizeMd="6">
                        {tasks.map(task=>(
                            <Task 
                                task_data={task}
                                subtasks={task_id=>this.getchildtasks(task_id)}
                                supertasks={task_id=>this.getsiblingtasks(task_id)}/>
                        ))}
                    </IonCol>
                    <IonCol size="12" sizeMd="6">
                        <AddTask/>
                    </IonCol>
                </IonRow>
            </IonGrid>
            )
    }
}

class Tasks extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            panestack: [null, null, null, null]
        }
    }
    render(){
        return (
            <IonSplitPane contentId="pane1" when="md">
                <div contentId="pane1" >
                    <p> content of pane 1</p>
                </div>
                <div id="pane1">
                    <IonSplitPane contentId="pane2" when="lg">
                        <div contentId="pane2">
                            <p>Second pane content</p>
                        </div>
                        <div id="pane2">
                            <IonSplitPane contentId="pane3" when="xl">
                                <div contentId="pane3">
                                    <p>Third pane content</p>
                                </div>
                                <div id="pane3">
                                    <p>Fourth pane content</p>
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
