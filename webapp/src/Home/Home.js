import React from 'react'
import {IonGrid, IonRow, IonCol} from '@ionic/react'
import {IonList, IonItem, IonText, IonProgressBar} from '@ionic/react'
import {IonCard, IonCardContent} from '@ionic/react'
import {IonCheckbox, IonLabel} from '@ionic/react'
import {IonButton} from '@ionic/react'
import {IonIcon} from '@ionic/react'
import {IonReorderGroup, IonReorder} from '@ionic/react'
import {caretForward} from 'ionicons/icons'

import '@ionic/core/css/core.css'
import '@ionic/core/css/ionic.bundle.css'


class Task extends React.Component{
    mark_task_complete(){
        // send data to the server and reload the task
        return;
    }
    start_task(task_completed){
        if (task_completed){
            return;
        }else{
            // invoke parent function
            return;
        }
    }
    render(){
        var task = this.props.task;
        var task_completed = this.props.task.status === "completed";
        var complete_style = {
            textDecoration:"line-through"
        };
        var card_style = task_completed?complete_style:null;
        return (
            <IonCard style={card_style}>
                <IonRow>
                    <IonCol size="3" sizeMd="2">
                        <IonList lines="none">
                            <IonItem>
                                <IonCheckbox color="primary" checked={task_completed} onChange={()=>this.mark_task_complete()}></IonCheckbox>
                            </IonItem>
                        </IonList>
                    </IonCol>
                    <IonCol size="6" sizeMd="8">
                        <IonText>
                            <h4>{task.title}</h4>
                            <p>{task.desc}</p>
                        </IonText>
                    </IonCol>
                    <IonCol size="3" sizeMd="2">
                        <IonList lines="none">
                            <IonItem>
                                <IonIcon icon={caretForward} onClick={()=>this.start_task(task_completed)}/>
                            </IonItem>
                        </IonList>
                    </IonCol>
                </IonRow>
            </IonCard>
        )
    }
}

class HeadTask extends React.Component{
    render(){
        var task =  this.props.task;
        console.log(this.props);
        return (
            <IonCard>
                <IonList style={{width:"100%"}} lines="none">
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="12" sizeMd="5">
                                    <IonText>
                                        <h4>{task.title}</h4>
                                    </IonText>
                                </IonCol>
                                <IonCol size="12" sizeMd="3">
                                    <IonText className="ion-text-center">
                                        <p>{task.title}</p>
                                    </IonText>
                                </IonCol>
                                <IonCol size="12" sizeMd="2">
                                    <IonButton color="danger" expand="block" size="default">Stop</IonButton>
                                </IonCol>
                                <IonCol size="12" sizeMd="2">
                                    <IonButton color="success" expand="block" size="default">Complete</IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                </IonList>
            </IonCard>
        )
    }
}
class Home extends React.Component{
    constructor(props){
        super(props);
        this.progress_colors = ["primary", "secondary", "tertiary"];
        this.state={
            progresses:{},
            tasks:{
                today:[],
                week:[]
            }
        };
    }
    componentDidMount(){
        fetch('/api/getToday')
        .then(response=>response.json())
        .then(data=>{
            var state_data = JSON.parse(JSON.stringify(this.state));
            state_data.tasks.today = data;
            this.setState(state_data);
            return;
        });
        fetch('/api/getWeek')
        .then(response=>response.json())
        .then(data=>{
            var state_data = JSON.parse(JSON.stringify(this.state));
            state_data.tasks.week = data;
            console.log(state_data);
            this.setState(state_data,()=>this.setProgresses());
            return;
        });
    }
    setProgresses(){
        console.log("callback called");
        this.setState((state)=>{
            var prog = {};
            var running_task = null;
            var tasks = state.tasks.today.concat(state.tasks.week);
            for (var i in tasks){
                if (tasks[i].class !== undefined){
                    for (var j in tasks[i].class){
                        if (prog[tasks[i].class[j]] === undefined){
                            prog[tasks[i].class[j]] = {
                                "planned":0,
                                "used":0
                            };
                        }
                        prog[tasks[i].class[j]].planned += tasks[i].planned_time?tasks[i].planned_time:0;
                        prog[tasks[i].class[j]].used += tasks[i].used_time?tasks[i].used_time:0;
                    }
                }
                if (tasks[i].status === "running"){
                    running_task = tasks[i];
                }
            }
            return {"progresses":prog, "running": running_task};
        });
    }
    render(){
        var centre_style = {
            "textAlign":"center"
        };
        var text = {
            "width":"100%"
        }
        var progresses = this.state.progresses;
        var tasks_today = this.state.tasks.today;
        var tasks_this_week = this.state.tasks.week;
        return (
            <IonGrid>
                {this.state.running && 
                    <IonRow>
                        <IonCol size="12">
                            <HeadTask task={this.state.running}/>
                        </IonCol>
                    </IonRow>
                }
                <IonRow>
                    <IonCol size="12" sizeMd="6">
                        <IonList lines="none">
                            {Object.entries(progresses).map(([k,progress],index)=>(
                                <div key={index}>
                                    <IonItem>
                                        <IonText style={{"width":"100%"}}>
                                            <p>
                                                <span style={{float:"left"}}>{k}</span>
                                                <span style={{float:"right"}}>{progress.used/progress.planned}%</span>
                                            </p>
                                            <br/>
                                            <IonProgressBar color={this.progress_colors[index%3]} value={progress.used/progress.planned}/>
                                        </IonText>
                                    </IonItem>
                                </div>
                            ))}
                        </IonList>
                    </IonCol>
                    <IonCol size="12" sizeMd="6">
                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    <IonText>
                                        <h2>My Day</h2>
                                    </IonText>
                                </IonCol>
                            </IonRow>
                            <IonReorderGroup disabled={false}>
                            {tasks_today.map((task,index)=>
                                <IonReorder key={index}>
                                    <Task task={task}/>
                                </IonReorder>
                            )}
                            </IonReorderGroup>
                            <IonRow>
                                <IonCol>
                                    <IonText>
                                        <h2>This Week</h2>
                                    </IonText>
                                </IonCol>
                            </IonRow>
                            {tasks_this_week.map((task,index)=>
                                <Task task={task} key={index}/>
                            )}
                        </IonGrid>
                    </IonCol>
                </IonRow>
            </IonGrid>
        )
    }
}

export default Home
