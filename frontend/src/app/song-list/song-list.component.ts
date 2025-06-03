import { Component, input, effect, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Song } from '../song.model';
import { PlayingSongsService } from '../playing.songs.service';
import { SongService } from '../song.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss'],
})
export class SongListComponent {

  songs = input<Song[]>();
  likesPerSong = signal<{ [songId: number]: number }>({});

  sortedSongs = computed(() => {
    const songsArr = this.songs() ?? [];
    return [...songsArr].sort((a, b) => {
      const likesA = this.likesPerSong()[a.id] || 0;
      const likesB = this.likesPerSong()[b.id] || 0;
      return likesB - likesA;
    });
  });

  constructor(private router: Router, private playingSongsService: PlayingSongsService, private songService: SongService){
    effect(() => {
      const songsArr = this.songs();
      if (songsArr && songsArr.length > 0) {
        this.songService.getLikesPerSong(songsArr).subscribe(likesMap => {
          this.likesPerSong.set(likesMap);
        }); 
      }
    });
    
  }

  play(songId: number) {
    this.playingSongsService.setPlayingSongs(this.songs()!);
    this.router.navigate(['/song-player', songId]);
  }
}
