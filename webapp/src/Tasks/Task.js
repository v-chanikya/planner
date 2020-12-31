import React from 'react'
import {IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonText} from '@ionic/react'
import {IonList, IonItem, IonLabel, IonCheckbox, IonTextarea, IonInput, IonDatetime, IonButton} from '@ionic/react'
import {add, chevronForward, chevronBack, caretForward, stop} from 'ionicons/icons'

class Task extends React.Component{
    constructor(props){
        super(props);
        var task_data = JSON.parse(JSON.stringify(this.props.task_data));
        if(task_data.planned_time){
            task_data.planned_time = this.get_date_string(task_data.planned_time);
        }
        this.state={
            "status":this.props.task_data.status?this.props.task_data.status:"stopped",
            "time_delta": this.time_delta(
                            this.props.task_data.end_time ? this.props.task_data.end_time: [],
                            this.props.task_data.start_time? this.props.task_data.start_time: []),
            "ticker_id":this.props.task_data.status === "running"?setInterval(()=>this.ticker(),1000):0,
            "full_task_view":false,
            "changed":false,
            "task_data":task_data
        }
        if (this.state.status === "running"){
            this.props.stopTimer(()=>this.stop_gui_ticker());
        }
    }
    /**
     ************************
     * Util functions
     ************************
     */
    /**
     * Convert seconds to date string
     */
    get_date_string(seconds){
        var date = new Date();
        date.setHours(0,0);
        date.setTime(date.getTime() + seconds*1000);
        return date.toISOString();
    }
    /**
     * The below function is used to measure the total time used for this task
     * Inputs are list of datetime strings in ISO format
     */
    time_delta(endDate, startDate){
        var time = 0;
        for (var i in endDate){
            time += Math.floor((new Date(endDate[i]) - new Date(startDate[i]))/1000);
        }
        if (endDate.length < startDate.length){
            time += Math.floor((new Date() - new Date(startDate[startDate.length - 1]))/1000);
        }
        var sec = Math.floor(time % 60);
        var min = Math.floor((time/60)%60);
        var hr = Math.floor(time/3600);
        var time_del = "" + Math.floor(hr/10) + "" + hr%10 +
        ":" + Math.floor(min/10) + "" + min%10 +
        ":" + Math.floor(sec/10) + "" + sec%10;
        return time_del;
    }
    /**
     * This function is invoked by the Tasks component to switch the display of task to stopped
     */
    stop_gui_ticker(){
        clearTimeout(this.state.ticker_id);
        this.setState({
            "ticker_id":0,
            "status":"stopped"
        });
    }
    /**
     ********************
     * Invoke backend API
     ********************
     */
    /**
     * Toggle the task between running and stopped states by sending the server request
     * Presently only one task can be running any given time.
     * So if a task is already running and we try to start another one
     * the previous task will be stopped by sending tasks component an event
     */
    toggle_state(){
        var time = new Date();
        fetch("/api/toggleTaskState", {
            method: 'POST',
            headers: {
                'Content-Type':'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                "task_id":this.props.task_data.task_id,
                "time":time.toISOString()
            })
        })
        .then(response=> response.json())
        .then(data => {
            var new_state = {};
            var date = new Date()
            var task_data = JSON.parse(JSON.stringify(this.state.task_data))
            if (this.state.status === "running"){
                new_state["status"] = "stopped";
                clearTimeout(this.state.ticker_id);
                new_state["ticker_id"] = 0;
                task_data.end_time.push(date.toISOString());
            }else{
                new_state["status"] = "running";
                new_state["ticker_id"] = setInterval(()=>this.ticker(),1000);
                this.props.stopTimer(()=>this.stop_gui_ticker());
                task_data.start_time.push(date.toISOString());
            }
            new_state["task_data"] = task_data;
            this.setState(new_state);
            return;
        })
    }
    /**
     * Submit the edited task
     */
    editTask(){
        var body = JSON.parse(JSON.stringify(this.state.task_data))
        if (body["planned_time"]){
            var date = new Date(body["planned_time"]);
            body["planned_time"] = date.getHours()*3600 + date.getMinutes()*60;
        }
        fetch("/api/editTask", {
            method: 'POST',
            headers: {
                'Content-Type':'application/json;charset=utf-8'
            },
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(data => {
            this.setState({
                "changed":false
            });
            this.props.reload();
            this.toggleSummary();
            return;
        })
    }
    /**
     ******************
     * View updaters
     ******************
     */
    /**
     * Toggels summary view
     */
    toggleSummary(){
        this.setState((state)=>{
            if (this.state.full_task_view){
                var task_data = JSON.parse(JSON.stringify(this.props.task_data));
                if(task_data.planned_time){
                    task_data.planned_time = this.get_date_string(task_data.planned_time);
                }
                return ({
                    "full_task_view":!this.state.full_task_view,
                    "task_data":task_data,
                    "changed":false
                });
            }else{
                return {"full_task_view":!this.state.full_task_view};
            }
        });
    }

    /**
     * The below function is used to tick time display every second
     */
    ticker(){
        var time = this.state.time_delta;
        time = time.split(":");
        var sec = Number(time[2]) + 1;
        var min = Number(time[1]);
        if(sec >= 60){
            sec = 0;
            min += 1; 
        }
        var hr = Number(time[0]);
        if(min >= 60){
            min = 0;
            hr += 1;
        }
        var time_del = "" + Math.floor(hr/10) + "" + hr%10 +
        ":" + Math.floor(min/10) + "" + min%10 +
        ":" + Math.floor(sec/10) + "" + sec%10;
        this.setState({"time_delta":time_del})
    }
    /**
     * Update summary state data
     */
    taskUpdate(e){
        const target = e.target;
        const value = target.value;
        const name = target.name;
        var task_data = JSON.parse(JSON.stringify(this.state.task_data))
        task_data[name] = value;
        if (name === "status" && !target.checked){
            task_data[name] = this.props.task_data[name];
        }
        this.setState({
            "changed":true,
            "task_data":task_data
        });
    }
    render(){
        var color = {background:"white"};
        if (this.props.selected === this.props.task_data.task_id)
            color = {background:"lightgrey"};
        var task_data = this.state.task_data;
        return (
            <IonCard style={color}>
                <IonRow>
                    <IonCol>
                        <IonCardHeader onClick={()=>this.toggleSummary()}>
                            <IonCardTitle>{task_data.title}</IonCardTitle>
                            <IonCardSubtitle>Meta data</IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent>{task_data.desc}</IonCardContent>
                    </IonCol>
                </IonRow>
                {this.state.full_task_view &&
                    <IonRow>
                        <IonList>
                            {task_data.start_time &&
                                task_data.start_time.map((date,index)=>(
                                    <IonItem key={index}>
                                        <p>{date}</p>
                                        <p>{task_data.end_time[index]}</p>
                                    </IonItem>
                                ))
                            }
                            <IonItem>
                                <IonLabel position="floating">Priority</IonLabel>
                                <IonInput value={task_data.priority} name="priority" type="text" onIonChange={(e)=>this.taskUpdate(e)}/>
                            </IonItem>
                            <IonItem>
                                <IonLabel>Planned</IonLabel>
                                <IonDatetime value={task_data.planned_time} placeholder="select hours" displayFormat="HH:mm" name="planned_time" onIonChange={(e)=>this.taskUpdate(e)}/>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Retro</IonLabel>
                                <IonTextarea value={task_data.retrospection} name="retrospection" type="text" onIonChange={(e)=>this.taskUpdate(e)}/>
                            </IonItem>
                            <IonItem>
                                <IonLabel>Mark complete</IonLabel>
                                <IonCheckbox value="completed" name="status" onIonChange={(e)=>this.taskUpdate(e)}/>
                            </IonItem>
                        </IonList>
                        {this.state.changed &&
                            <IonCol size="12">
                                <IonButton color="light" expand="full" onClick={()=>this.editTask()}>Submit</IonButton>
                            </IonCol>
                        }
                    </IonRow>
                }
                <hr/>
                <IonRow className="ion-text-center">
                    <IonCol size="2" className="ion-text-left" onClick={() => this.props.supertasks(task_data.parent_id)}>
                        <IonIcon icon={chevronBack} size="small"/>
                    </IonCol>
                    <IonCol size="2" onClick={()=> this.toggle_state()}>
                        {this.state.status === "running"
                            ?<IonIcon icon={stop} size="small" color="green"/>
                            :<IonIcon icon={caretForward} size="small" color="green"/>
                        }
                    </IonCol>
                    <IonCol size="4">
                        <IonText>{this.state.time_delta}</IonText>
                    </IonCol>
                    <IonCol size="2" onClick={()=>this.props.newtaskpane(task_data.task_id,true)}>
                        <IonIcon icon={add} size="small"/>
                    </IonCol>
                    <IonCol size="2" className="ion-text-right" onClick={() => this.props.subtasks(task_data.task_id)}>
                        <IonIcon icon={chevronForward} size="small"/>
                    </IonCol>
                </IonRow>
            </IonCard>
        )
    }
}

export default Task
