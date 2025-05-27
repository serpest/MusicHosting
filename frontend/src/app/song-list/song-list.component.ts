import { Component, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Song } from '../song.model';
import { PlayingSongsService } from '../playing.songs.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss'],
})
export class SongListComponent {

  songs = input<Song[]>();
  
  constructor(private router: Router, private playingSongsService: PlayingSongsService) {}

  play(songId: number) {
    this.playingSongsService.setPlayingSongs(this.songs()!);
    this.router.navigate(['/song-player', songId]);
  }

}
