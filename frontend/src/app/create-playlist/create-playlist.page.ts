import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController, IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Playlist } from '../playlist.model';
import { PlaylistService } from '../playlist.service';

@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.page.html',
  styleUrls: ['./create-playlist.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule]
})
export class CreatePlaylistPage implements ViewWillEnter {

  playlistForm = new FormGroup({
    title: new FormControl<NonNullable<string>>('', [Validators.required, Validators.minLength(1), Validators.maxLength(100)])
  });

  constructor(private playlistService: PlaylistService, private router: Router, private alertController: AlertController) {}

  ionViewWillEnter() {
    this.playlistForm.reset();
  }

  submit() {
    const playlist = new Playlist(
      -1,
      this.playlistForm.value.title ?? '',
      -1,
      []
    );
    this.playlistService.createPlaylist(playlist).subscribe({
      next: (response) => {
        this.router.navigate(['playlist-viewer', response.playlistId]);
      },
      error: (error) => {
        console.error('Error creating playlist:', error);
        this.alertController.create({
          header: 'Error',
          message: 'Failed to create playlist',
          buttons: ['Ok']
        }).then(alert => {
          alert.present();
        });
      }
    });
  }

}
