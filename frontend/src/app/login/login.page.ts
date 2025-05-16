import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter } from '@ionic/angular/standalone';
import { UserService } from '../user.service';
import { TokenService } from '../token.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements ViewWillEnter {

  loginForm = new FormGroup({
    email: new FormControl<NonNullable<string>>('', [Validators.required, Validators.email]),
    password: new FormControl<NonNullable<string>>('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)])
  });

  constructor(private userService: UserService, private tokenService: TokenService, private router: Router, private alertController: AlertController) {}

  ionViewWillEnter() {
    this.userService.validateToken().subscribe({
      next: () => {
        this.alertController.create({
          header: 'Already logged in',
          message: 'You are already logged in',
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
    });
  }

  submit() {
      this.userService.login(this.loginForm.value.email ?? '', this.loginForm.value.password ?? '').subscribe({
        next: (response) => {
          this.tokenService.setToken(response.token);
          this.alertController.create({
            header: 'Success',
            message: 'Login successful',
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
        },
        error: () => {
          this.alertController.create({
            header: 'Error',
            message: 'Invalid email or password',
            buttons: ['Ok']
          }).then(alert => {
            alert.present();
          });
        }
    });
  }

  switchToRegister() {
    this.router.navigate(['auth', 'register']);
  }

}
