import React from 'react'
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel } from '@ionic/react'
import {home, checkbox, calendar, book} from 'ionicons/icons'

class Menu extends React.Component {
    render(){
        return (
            <IonMenu side="start" contentId="app">
                <IonHeader>
                    <IonToolbar translucent>
                        <IonTitle>Start Menu</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonList>
                        <IonItem routerLink='/'>
                            <IonIcon icon={home} slot="start"></IonIcon>
                            <IonLabel>Home</IonLabel>
                        </IonItem>
                        <IonItem routerLink='/tasks'>
                            <IonIcon icon={checkbox} slot="start"></IonIcon>
                            <IonLabel>Tasks</IonLabel>
                        </IonItem>
                        <IonItem routerLink='/planner'>
                            <IonIcon icon={calendar} slot="start"></IonIcon>
                            <IonLabel>Planning</IonLabel>
                        </IonItem>
                        <IonItem routerLink='/guides'>
                            <IonIcon icon={book} slot="start"></IonIcon>
                            <IonLabel>Guidelines</IonLabel>
                        </IonItem>
                    </IonList>
                </IonContent>
            </IonMenu>            
        )
    }
}
export default Menu
