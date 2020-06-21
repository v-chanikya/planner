import React from 'react'
import {IonRow, IonCol, IonText, IonList, IonItem, IonLabel, IonInput, IonTextarea, IonDatetime, IonButton} from '@ionic/react'

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
                <IonText color="medium" className="ion-text-center">
                    <h2>Add Task</h2>
                </IonText>
                <IonText color="medium">
                    <p>Parent id:{this.props.parentid}</p>
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
                <IonRow>
                    <IonCol size="6">
                        <IonButton color="success" expand="block" onClick={()=>this.addTask()}>Add</IonButton>
                    </IonCol>
                    <IonCol size="6">
                        <IonButton color="danger" expand="block" onClick={()=>this.props.newtaskpane(this.props.parentid, false)}>Cancel</IonButton>
                    </IonCol>
                </IonRow>
            </div>
        )
    }
}

export default AddTask
