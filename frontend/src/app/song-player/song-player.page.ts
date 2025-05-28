import { Component, input, OnDestroy, OnInit } from '@angular/core';
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
export class SongPlayerPage implements OnInit, ViewWillLeave {

  song: Song | undefined;
  currentTime: number = 0;
  duration: number = 0;
  isExisting: boolean = false;
  playingSongs: Song[] = [];
  isLiked: boolean = false;
  isPlaying: boolean = false;

  constructor(private route: ActivatedRoute, private songService: SongService, private userService: UserService, private router: Router,
              private playingSongsService: PlayingSongsService, private alertController: AlertController) {}

  ngOnInit() {
    this.userService.validateToken().subscribe({
      next: () => {
        this.route.params.subscribe(data => {
          this.songService.getSongById(data['songId']).subscribe((songData: any) => {
            this.isExisting = true;
            this.song = Song.fromJson(songData.song);
            if (!(this.playingSongsService.getIsMiniPlayerDisplayed() && this.playingSongsService.getPlayingSong() !== undefined
            && this.playingSongsService.getPlayingSong()?.id == data['songId'])) {
               if (this.playingSongsService.getIsPlaying()) {
                this.pauseSong();
              }
              // Audio is not already playing in mini player or it's a different song, so we create a new Audio instance
              this.playingSongsService.setAudio(new Audio(`http://localhost:3000/songs/id/${this.song?.id}/audio`));
            }
            this.playingSongsService.setIsMiniPlayerDisplayed(false);
            this.playingSongsService.getAudio().addEventListener('timeupdate', () => {
              if (this.playingSongs.length > 1 && this.playingSongsService.getAudio() && this.playingSongsService.getAudio().currentTime > 0 &&
                  this.playingSongsService.getAudio().currentTime == this.playingSongsService.getAudio().duration && !this.playingSongsService.getIsMiniPlayerDisplayed()) {
                this.playNextSong();
              }
              this.currentTime = this.playingSongsService.getAudio()?.currentTime || 0;
            });
            this.playingSongsService.getAudio().addEventListener('loadedmetadata', () => {
              this.duration = this.playingSongsService.getAudio()?.duration || 0;
            });
            this.playingSongs = this.playingSongsService.getPlayingSongs();
            if (this.playingSongs.length === 0) {
              this.playingSongsService.setPlayingSongs([this.song!]);
              this.playingSongsService.setPlayingIndex(0);
            } else {
              const currentIndex = this.playingSongs.findIndex(song => song.id == data['songId']);
              this.playingSongsService.setPlayingIndex(currentIndex);
            }
            this.playSong();
            
            this.songService.isSongLiked(this.song.id).subscribe({
              next: res => {
                this.isLiked = res.liked;
              }
            });
          });
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
    if (this.isExisting) {
        this.playingSongsService.setIsMiniPlayerDisplayed(true);
    }
  }

  playSong() {
    if (this.playingSongsService.getAudio()) {
      this.playingSongsService.getAudio().play().catch((error) => {
        console.error('[ERROR] Error playing audio:', error);
      });
      this.playingSongsService.setIsPlaying(true);
    }
  }

  pauseSong() {
    if (this.playingSongsService.getAudio()) {
      this.playingSongsService.getAudio().pause();
      this.playingSongsService.setIsPlaying(false);
    }
  }

  restartSong() {
    if (this.playingSongsService.getAudio()) {
      this.playingSongsService.getAudio().currentTime = 0;
      this.playSong();
    }
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  seek(event: Event) {
    const target = event.target as HTMLInputElement;
    const seekTime = parseFloat(target.value);
    if (this.playingSongsService.getAudio()) {
      this.playingSongsService.getAudio().currentTime = seekTime;
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

  likeSong() {
    console.log('Like song:', this.song?.id); 
    this.songService.likeSong(this.song?.id || 0).subscribe({
      next: () => {
        this.isLiked = true;
      },
      error: (error) => {
        console.error('Error liking song:', error);
      }
    });
  }

  unlikeSong() {
    console.log('Unlike song:', this.song?.id);
    this.songService.unlikeSong(this.song?.id || 0).subscribe({
      next: () => {
        this.isLiked = false;
      },
      error: (error) => {
        console.error('Error unliking song:', error);
      }
    }); 
  }

}
