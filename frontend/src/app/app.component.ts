import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonFooter, IonApp, IonButton, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonRouterOutlet, IonTitle, IonToolbar, IonMenuToggle } from '@ionic/angular/standalone';
import { MiniPlayerComponent } from './mini-player/mini-player.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonFooter, IonApp, IonRouterOutlet, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonTitle, IonToolbar, IonButton, RouterModule, IonMenuToggle, MiniPlayerComponent],
})
export class AppComponent {
  constructor() {}
}
