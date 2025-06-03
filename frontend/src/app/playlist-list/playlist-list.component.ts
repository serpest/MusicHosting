import { Component, input, OnInit } from '@angular/core';
import { Playlist } from '../playlist.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-playlist-list',
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.scss'],
})
export class PlaylistListComponent {

  playlists = input<Playlist[]>();
  
  constructor(private router: Router) {}

  open(playlistId: number) {
    this.router.navigate(['/playlist-viewer', playlistId]);
  }

}
