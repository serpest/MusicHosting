import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillLeave } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { Song } from '../song.model';
import { SongService } from '../song.service';
import { PlayingSongsService } from '../playing.songs.service';
import { UserService } from '../user.service';
import { AlertController } from '@ionic/angular';
import { FastAverageColor } from 'fast-average-color';

@Component({
  selector: 'app-song-player',
  templateUrl: './song-player.page.html',
  styleUrls: ['./song-player.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SongPlayerPage implements OnInit, ViewWillLeave, AfterViewInit {

  @ViewChildren('songItem')
  songItemElements!: QueryList<ElementRef<HTMLLIElement>>;

  song: Song | undefined;
  currentTime: number = 0;
  duration: number = 0;
  isExisting: boolean = false;
  playingSongs: Song[] = [];
  isLiked: boolean = false;
  isPlaying: boolean = false;
  likes: number = 0;

  constructor(private route: ActivatedRoute, private songService: SongService, private userService: UserService, private router: Router,
              private playingSongsService: PlayingSongsService, private alertController: AlertController) {}

  ngOnInit() {
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
          this.playingSongsService.getAudio().addEventListener('loadedmetadata', () => {
            this.duration = this.playingSongsService.getAudio()?.duration || 0;
          });
        } else {
          this.duration = this.playingSongsService.getAudio().duration;
        }
        this.playingSongsService.setIsMiniPlayerDisplayed(false);
        this.playingSongsService.getAudio().addEventListener('timeupdate', () => {
          if (this.playingSongs.length > 1 && this.playingSongsService.getAudio() && this.playingSongsService.getAudio().currentTime > 0 &&
              this.playingSongsService.getAudio().currentTime == this.playingSongsService.getAudio().duration && !this.playingSongsService.getIsMiniPlayerDisplayed()) {
            this.playNextSong();
          }
          this.currentTime = this.playingSongsService.getAudio()?.currentTime || 0;
        });
        this.playingSongs = this.playingSongsService.getPlayingSongs();
        if (this.playingSongs.length === 0) {
          this.playingSongsService.setPlayingSongs([this.song!]);
          this.playingSongsService.setPlayingIndex(0);
        } else {
          const currentIndex = this.playingSongs.findIndex(song => song.id == data['songId']);
          this.playingSongsService.setPlayingIndex(currentIndex);
          this.playSong();
        }
        this.songService.isSongLiked(this.song.id).subscribe({
          next: res => {
            this.isLiked = res.liked;
          }
        });
        this.songService.getLikesCount(this.song.id).subscribe({
          next: res => {
            this.likes = res.likes;
          }
        });
      });
    });
  }

  ionViewWillLeave() {
    if (this.isExisting) {
        this.playingSongsService.setIsMiniPlayerDisplayed(true);
    }
  }

  ngAfterViewInit() {
    this.playingSongsService.setIsMiniPlayerDisplayed(false);
    const fac = new FastAverageColor();
    this.songItemElements.changes.subscribe(songItemRefs => {
      songItemRefs.forEach((songItemRef: { nativeElement: any; }) => {
        const container = songItemRef.nativeElement;
        const imgElement = container.querySelector('.song-image') as HTMLImageElement;
        if (imgElement) {
          fac.getColorAsync(imgElement)
            .then(color => {
              container.style.backgroundImage = `linear-gradient(to bottom, ${color.rgba}, #121212)`;
              container.style.color = color.isDark ? '#fff' : '#000';
            })
            .catch(e => {
              console.error('Failed to get average color for image:', imgElement.src);
            });
        }
      });
    });
  }

  playSong() {
    if (this.playingSongsService.getAudio()) {
      this.playingSongsService.getAudio().play().catch((error) => {
        console.error('[ERROR] Error playing audio:', error);
      });
      this.playingSongsService.setIsPlaying(true);
      this.isPlaying = true;
    }
  }

  pauseSong() {
    if (this.playingSongsService.getAudio()) {
      this.playingSongsService.getAudio().pause();
      this.playingSongsService.setIsPlaying(false);
      this.isPlaying = false;
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
    this.pauseSong();
    if (currentIndex > 0) {
      this.playAnotherSong(this.playingSongs[currentIndex - 1].id);
    } else {
      this.playAnotherSong(this.playingSongs[this.playingSongs.length - 1].id);
    }
  }

  playNextSong() {
    const currentIndex = this.playingSongs.findIndex(song => song.id === this.song?.id);
    this.pauseSong()
    if (currentIndex < this.playingSongs.length - 1) {
      this.playAnotherSong(this.playingSongs[currentIndex + 1].id);
    } else {
      this.playAnotherSong(this.playingSongs[0].id);
    }
  }

  likeSong() {
    this.songService.likeSong(this.song?.id || 0).subscribe({
      next: () => {
        this.isLiked = true;
        this.likes++;
      },
      error: (error) => {
        console.error('Error liking song:', error);
      }
    });
  }

  unlikeSong() {
    this.songService.unlikeSong(this.song?.id || 0).subscribe({
      next: () => {
        this.isLiked = false;
        this.likes--;
      },
      error: (error) => {
        console.error('Error unliking song:', error);
      }
    }); 
  }

}
