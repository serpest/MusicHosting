import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './user.service';
import { AlertController } from '@ionic/angular';

// See https://ionic.io/docs/auth-connect/tutorials/angular/protecting-routes
export const tokenGuard: CanActivateFn = async () => {
  const userService = inject(UserService);
  const alertController = inject(AlertController);
  const router = inject(Router);
  if (await userService.isTokenValid()) {
    return true;
  }
  alertController.create({
    header: 'Not logged in',
    message: 'You need to be logged in to access the selected functionality',
    buttons: [
      {
        text: 'Ok',
        handler: () => {
          router.navigate(['auth']);
        }
      }
    ]
  }).then(alert => {
    alert.present();
  });
  return false;
};  
