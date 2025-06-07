import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { TokenService } from '../token.service';
import { UserService } from '../user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegisterPage implements ViewWillEnter {

  registerForm = new FormGroup({
    email: new FormControl<NonNullable<string>>('', [Validators.required, Validators.email]),
    name: new FormControl<NonNullable<string>>('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    password: new FormControl<NonNullable<string>>('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)])
  });

  constructor(private userService: UserService, private tokenService: TokenService, private router: Router, private alertController: AlertController) {}

  ionViewWillEnter() {
    this.registerForm.reset();
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
      this.userService.register(this.registerForm.value.email ?? '', this.registerForm.value.name ?? '', this.registerForm.value.password ?? '').subscribe({
        next: () => {
          this.userService.login(this.registerForm.value.email ?? '', this.registerForm.value.password ?? '').subscribe({
            next: (response) => {
              this.tokenService.setToken(response.token);
              this.alertController.create({
                header: 'Success',
                message: 'Registration successful',
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
              // This code should not be reached, but just in case
              this.alertController.create({
                header: 'Error',
                message: 'Invalid email or password after registration',
                buttons: ['Ok']
              }).then(alert => {
                alert.present();
              });
            }
          });
        },
        error: (error) => {
          let alertMessage = 'Registration failed';
          if (error.status === 409) {
            alertMessage = 'Email already registered';
          }
          this.alertController.create({
            header: 'Error',
            message: alertMessage,
            buttons: ['Ok']
          }).then(alert => {
            alert.present();
          });
        },
    });
  }

  switchToLogin() {
    this.router.navigate(['auth', 'login']);
  }

}
