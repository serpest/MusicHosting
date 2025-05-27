import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter } from '@ionic/angular/standalone';
import { UserService } from '../user.service';
import { TokenService } from '../token.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { PlayingSongsService } from '../playing.songs.service';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.page.html',
  styleUrls: ['./manage-account.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ManageAccountPage implements ViewWillEnter {

  constructor(private playingSongsService: PlayingSongsService, private userService: UserService, private tokenService: TokenService, private router: Router, private alertController: AlertController) {}

  ionViewWillEnter() {
    this.userService.validateToken().subscribe({
      error: () => {
        this.alertController.create({
          header: 'Not logged in',
          message: 'You need to be logged in to access this page',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                this.router.navigate(['auth']);
              }
            }
          ]
        }).then(alert => {
          alert.present();
        });
      }
    });
  }

  logout() {
    this.playingSongsService.setIsMiniPlayerDisplayed(false);
    this.tokenService.removeToken();
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
