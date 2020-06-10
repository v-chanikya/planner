import React from 'react'
import {Route} from "react-router-dom"
import {IonApp, IonHeader, IonFooter, IonToolbar, IonTitle, IonContent, IonPage, IonButton, IonMenuButton, IonSplitPane} from '@ionic/react'
import {IonReactRouter} from '@ionic/react-router'
import '@ionic/react/css/core.css'
import Menu from './Menu'
import Home from './Home'
import Tasks from './Tasks'
import Planner from './Planner'
import Guide from './Guide'

class App extends React.Component {
    render(){
        return (
            <IonApp>
                <IonSplitPane contentId="app" when="xl" className="menuSplitPane">
                    <Menu/>
                    <IonPage id="app">
                        <IonHeader>
                            <IonToolbar>
                                <IonButton slot="start" color="dark" fill="clear">
                                    <IonMenuButton/>
                                </IonButton>
                                <IonTitle>Planner</IonTitle>
                            </IonToolbar>
                        </IonHeader>

                        <IonContent>
                            <IonReactRouter>
                                <Route path="/" exact component={Home} />
                                <Route path="/tasks" exact component={Tasks} />
                                <Route path="/planner" exact component={Planner} />
                                <Route path="/guides" exact component={Guide} />
                            </IonReactRouter>
                        </IonContent>

                        <IonFooter>
                            <IonToolbar>God speed</IonToolbar>
                        </IonFooter>
                    </IonPage>
                </IonSplitPane>
            </IonApp>
        )
    }
}

export default App
