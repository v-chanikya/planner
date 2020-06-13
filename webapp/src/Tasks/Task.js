import React from 'react'
import {IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonText} from '@ionic/react'
import {add, chevronForward, chevronBack, caretForward, stop} from 'ionicons/icons'

class Task extends React.Component{
    constructor(props){
        super(props);
        this.state={
            "status":this.props.task_data.status?this.props.task_data.status:"stopped",
            "time_delta": this.time_delta(
                            this.props.task_data.end_time && this.props.task_data.status === "stopped" ? new Date(this.props.task_data.end_time): new Date(),
                            this.props.task_data.start_time? new Date(this.props.task_data.start_time): new Date()),
            "ticker_id":this.props.task_data.status === "running"?setInterval(()=>this.ticker(),1000):0
        }
    }
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
        this.setState({
            "status":this.state.status,
            "time_delta":time_del,
            "ticker_id":this.state.ticker_id
        })
    }
    time_delta(endDate, startDate){
        var time = Math.floor((endDate - startDate)/1000);
        var sec = Math.floor(time % 60);
        var min = Math.floor((time/60)%60);
        var hr = Math.floor(time/3600);
        var time_del = "" + Math.floor(hr/10) + "" + hr%10 +
        ":" + Math.floor(min/10) + "" + min%10 +
        ":" + Math.floor(sec/10) + "" + sec%10;
        return time_del;
    }
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
            var new_state = {
                "time_delta":this.state.time_delta
                };
            if (this.state.status === "running"){
                new_state["status"] = "stopped";
                clearTimeout(this.state.ticker_id);
                new_state["ticker_id"] = 0;
            }else{
                new_state["status"] = "running";
                new_state["ticker_id"] = setInterval(()=>this.ticker(),1000);
            }
            this.setState(new_state);
        })
    }
    render(){
        var color = {background:"white"};
        if (this.props.selected === this.props.task_data.task_id)
            color = {background:"lightgrey"};

        return (
            <IonCard style={color}>
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
                    <IonCol size="2" onClick={()=> this.toggle_state()}>
                        {this.state.status === "running"
                            ?<IonIcon icon={stop} size="small" color="green"/>
                            :<IonIcon icon={caretForward} size="small" color="green"/>
                        }
                    </IonCol>
                    <IonCol size="4">
                        <IonText>{this.state.time_delta}</IonText>
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

export default Task
