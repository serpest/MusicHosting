import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonApp, IonButton, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonRouterOutlet, IonTitle, IonToolbar, IonMenuToggle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonTitle, IonToolbar, IonButton, RouterModule, IonMenuToggle],
})
export class AppComponent {
  constructor() {}
}
