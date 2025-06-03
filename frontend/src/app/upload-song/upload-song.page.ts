import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Song } from '../song.model';
import { SongService } from '../song.service';
import { UserService } from '../user.service';
import { AlertController } from '@ionic/angular';
import { PlayingSongsService } from '../playing.songs.service';

@Component({
  selector: 'app-upload-song',
  templateUrl: './upload-song.page.html',
  styleUrls: ['./upload-song.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule]
})
export class UploadSongPage {

  songForm = new FormGroup({
    title: new FormControl<NonNullable<string>>('', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]),
    artist: new FormControl<NonNullable<string>>('', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]),
    album: new FormControl<NonNullable<string>>('', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]),
    genre: new FormControl<NonNullable<string>>('', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]),
    releaseYear: new FormControl<NonNullable<string>>('', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(0), Validators.max(2100)]),
    audioPath: new FormControl<NonNullable<string>>('', [Validators.required]),
    albumPicturePath: new FormControl<NonNullable<string>>('', [Validators.required])
  });
  audioFile: File | undefined;
  albumPictureFile: File | undefined;

  constructor(private userService: UserService, private songService: SongService, private router: Router, private alertController: AlertController, private playingSongsService: PlayingSongsService) {}

  audioFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.audioFile = target.files?.[0] || undefined;
  }

  albumPictureFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.albumPictureFile = target.files?.[0] || undefined;
  }

  submit() {
    const song = new Song(
      -1,
      this.songForm.value.title ?? '',
      this.songForm.value.artist ?? '',
      this.songForm.value.album ?? '',
      this.songForm.value.genre ?? '',
      parseInt(this.songForm.value.releaseYear ?? '0', 10)
    );
    this.songService.submitSong(song).subscribe({
      next: (response) => {
        this.songService.submitSongAudio(response.songId, this.audioFile!).subscribe({
          next: () => {
            this.songService.submitSongAlbumPicture(response.songId, this.albumPictureFile!).subscribe({
              next: () => {
                this.playingSongsService.setPlayingSongs([]);
                this.playingSongsService.setPlayingIndex(-1);
                this.router.navigate(['song-player', response.songId]);
              },
              error: () => {
                this.alertController.create({
                  header: 'Error',
                  message: 'Failed to upload album picture',
                  buttons: ['Ok']
                }).then(alert => {
                  alert.present();
                });
              }
            });
          },
          error: () => {
            this.alertController.create({
              header: 'Error',
              message: 'Failed to upload audio file',
              buttons: ['Ok']
            }).then(alert => {
              alert.present();
            });
          }
        });
      },
      error: () => {
        this.alertController.create({
          header: 'Error',
          message: 'Failed to upload song details',
          buttons: ['Ok']
        }).then(alert => {
          alert.present();
        });
      }
    });
  }

}
