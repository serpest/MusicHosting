import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController, IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter } from '@ionic/angular/standalone';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ResetPasswordPage implements ViewWillEnter {

  resetPasswordForm = new FormGroup({
    otp: new FormControl<NonNullable<string>>('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
    password: new FormControl<NonNullable<string>>('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)])
  });

  constructor(private userService: UserService, private router: Router, private alertController: AlertController, private activatedRoute: ActivatedRoute) {}

  ionViewWillEnter() {
    this.resetPasswordForm.reset();
  }

  submit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const email = params['email'];
      this.userService.resetPassword(email, this.resetPasswordForm.value.otp ?? '', this.resetPasswordForm.value.password ?? '').subscribe({
        next: () => {
          this.alertController.create({
            header: 'Success',
            message: 'Password has been reset successfully',
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.router.navigate(['auth', 'login']);
                }
              }
            ]
          }).then(alert => alert.present());
        },
        error: () => {
          this.alertController.create({
            header: 'Error',
            message: 'Failed to reset password',
            buttons: ['Ok']
          }).then(alert => alert.present());
        }
      });
    });
  }


}
