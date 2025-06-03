import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonApp, IonButton, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonRouterOutlet, IonTitle, IonToolbar, IonMenuToggle, IonFooter, AlertController } from '@ionic/angular/standalone';
import { MiniPlayerComponent } from './mini-player/mini-player.component';
import { UserService } from './user.service';
import { TokenService } from './token.service';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [ CommonModule, IonFooter, IonApp, IonRouterOutlet, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonTitle, IonToolbar, IonButton, RouterModule, IonMenuToggle, MiniPlayerComponent
  ],
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(private userService: UserService, private tokenService: TokenService, private router: Router, private alertController: AlertController) {}

  ngOnInit() {
    this.userService.isLoggedInObservable.subscribe(status => {
      this.isLoggedIn = status;
    });
    this.userService.checkAuth(); // Check login status on app start
  }

  logout() {
    this.tokenService.removeToken();
    this.userService.setLoggedIn(false);
    this.alertController.create({
      header: 'Success',
      message: 'Logout successful',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.router.navigate(['']);
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
  }
}
