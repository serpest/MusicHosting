import { Component, OnInit } from '@angular/core';
import { PlayingSongsService } from '../playing.songs.service';
import { Song } from '../song.model';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SongService } from '../song.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-mini-player',
  templateUrl: './mini-player.component.html',
  styleUrls: ['./mini-player.component.scss'],
})
export class MiniPlayerComponent {

  isDisplayed: boolean = false;
  playingSongs: Song[] = [];
  playingIndex: number = -1;
  isPlaying: boolean = false;
  song: Song | undefined;

  currentTime: number = 0;
  duration: number = 0;

  constructor(private router: Router, private songService: SongService, private playingSongsService: PlayingSongsService) {
    this.playingSongsService.getIsMiniPlayerDisplayedObservable().subscribe(
      isDisplayed => {
        this.isDisplayed = isDisplayed;
        if (!isDisplayed) {
          this.pauseSong(); 
        }
      }
    );
    this.playingSongsService.getPlayingSongsObservable().subscribe(
      playingSongs => {
        this.playingSongs = playingSongs;
      }
    );
    this.playingSongsService.getPlayingIndexObservable().subscribe(
      playingIndex => {
        this.playingIndex = playingIndex;
        this.song = this.playingSongs[playingIndex];
        this.playingSongsService.getAudio().addEventListener('timeupdate', () => {
          if (this.isDisplayed && this.playingSongs.length > 1 && this.playingSongsService.getAudio().currentTime > 0 &&
              this.playingSongsService.getAudio().currentTime == this.playingSongsService.getAudio().duration) {
            this.playNextSong();
          }
        });
      }
    );
    this.playingSongsService.getIsPlayingObservable().subscribe(
      isPlaying => {
        this.isPlaying = isPlaying;
      }
    );
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

  playPreviousSong() {
    if (this.playingIndex > 0) {
      this.playAnotherSong(this.playingIndex - 1);
    }
  }

  playNextSong() {
    if (this.playingIndex < this.playingSongs.length - 1) {
      this.playAnotherSong(this.playingIndex + 1);
    }
  }

  playAnotherSong(songIndex: number) {
    if (songIndex >= 0 && songIndex < this.playingSongs.length) {
      this.pauseSong();
      this.playingSongsService.setIsPlaying(false);
      this.playingSongsService.setAudio(new Audio(`http://localhost:3000/songs/id/${this.playingSongs[songIndex].id}/audio`));
      this.playingSongsService.setPlayingIndex(songIndex);
      this.playSong();
    }
  }

  open() {
    this.router.navigate(['/song-player', this.song?.id]);
  }

  close() {
    this.playingSongsService.setIsMiniPlayerDisplayed(false);
  }

}
