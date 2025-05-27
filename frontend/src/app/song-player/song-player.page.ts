import { Component, input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter, ViewWillLeave } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { Song } from '../song.model';
import { SongService } from '../song.service';
import { PlayingSongsService } from '../playing.songs.service';
import { UserService } from '../user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-song-player',
  templateUrl: './song-player.page.html',
  styleUrls: ['./song-player.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SongPlayerPage implements ViewWillEnter, ViewWillLeave {

  song: Song | undefined;
  audio: HTMLAudioElement | undefined;
  currentTime: number = 0;
  duration: number = 0;
  isExisting: boolean = false;
  playingSongs: Song[] = [];

  constructor(private route: ActivatedRoute, private songService: SongService, private userService: UserService, private router: Router,
              private playingSongsService: PlayingSongsService, private alertController: AlertController) {}

  ionViewWillEnter() {
    this.userService.validateToken().subscribe({
      next: () => {
        this.route.params.subscribe(data => {
          this.songService.getSongById(data['songId']).subscribe((songData: any) => {
            this.isExisting = true;
            this.song = Song.fromJson(songData.song);
            this.audio = new Audio(`http://localhost:3000/songs/id/${this.song?.id}/audio`);
            this.audio.addEventListener('timeupdate', () => {
              if (this.playingSongs.length > 1 && this.audio && this.audio.currentTime > 0 &&
                  this.audio.currentTime == this.audio.duration) {
                this.playNextSong();
              }
              this.currentTime = this.audio?.currentTime || 0;
            });
            this.audio.addEventListener('loadedmetadata', () => {
              this.duration = this.audio?.duration || 0;
            });
            this.playSong();
          });
          this.playingSongs = this.playingSongsService.getPlayingSongs();
        });
      },
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

  ionViewWillLeave() {
    this.pauseSong();
  }

  playSong() {
    if (this.audio) {
      this.audio.play().catch((error) => {
        console.error('[ERROR] Error playing audio:', error);
      });
    }
  }

  pauseSong() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  restartSong() {
    if (this.audio) {
      this.audio.currentTime = 0;
      this.playSong();
    }
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  seek($event: Event) {
    const target = $event.target as HTMLInputElement;
    const seekTime = parseFloat(target.value);
    if (this.audio) {
      this.audio.currentTime = seekTime;
      this.currentTime = seekTime;
    }
  }

  playAnotherSong(songId: number) {
    this.pauseSong();
    this.router.navigate(['/song-player', songId]);
  }

  playPreviousSong() {
    const currentIndex = this.playingSongs.findIndex(song => song.id === this.song?.id);
    if (currentIndex > 0) {
      this.pauseSong();
      this.playAnotherSong(this.playingSongs[currentIndex - 1].id);
    }
  }

  playNextSong() {
    const currentIndex = this.playingSongs.findIndex(song => song.id === this.song?.id);
    if (currentIndex < this.playingSongs.length - 1) {
      this.pauseSong()
      this.playAnotherSong(this.playingSongs[currentIndex + 1].id);
    }
  }

}
