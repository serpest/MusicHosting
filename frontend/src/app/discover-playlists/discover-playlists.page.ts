import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter } from '@ionic/angular/standalone';
import { Playlist } from '../playlist.model';
import { PlaylistService } from '../playlist.service';
import { PlaylistListComponent } from "../playlist-list/playlist-list.component";

@Component({
  selector: 'app-discover-playlists',
  templateUrl: './discover-playlists.page.html',
  styleUrls: ['./discover-playlists.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, PlaylistListComponent]
})
export class DiscoverPlaylistsPage implements ViewWillEnter {

  randomPlaylists: Playlist[] = [];

  constructor(private playlistService: PlaylistService) {}

  ionViewWillEnter() {
    this.playlistService.getRandomPlaylists(10).subscribe((playlistsData: any) => {
      this.randomPlaylists = playlistsData.playlists.map((playlistData: any) => Playlist.fromJsonWithoutCreatorAndSongs(playlistData));
    });
  }

}
