import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ForgotPasswordPage {

  forgotPasswordForm = new FormGroup({
    email: new FormControl<NonNullable<string>>('', [Validators.required, Validators.email]),
  });

  constructor(private userService: UserService, private router: Router, private alertController: AlertController) {}

  submit() {
    this.userService.forgotPassword(this.forgotPasswordForm.value.email ?? '').subscribe({
      next: () => {this.alertController.create({
        header: 'Success',
        message: 'An OTP has been sent to your email address',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.router.navigate(['auth', 'reset-password'], {queryParams: { email: this.forgotPasswordForm.value.email }});
            }
          }
        ]
        }).then(alert => alert.present());
      },
      error: (error) => {
        this.alertController.create({
          header: 'Error',
          message: 'Failed to send OTP. Please check the e-mail address.',
          buttons: ['Ok']
        }).then(alert => alert.present());
      }
    });
  }

  switchToLogin() {
    this.router.navigate(['auth', 'login']);
  }

}
