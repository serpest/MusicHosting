import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { Playlist } from '../playlist.model';
import { PlaylistService } from '../playlist.service';
import { PlaylistListComponent } from "../playlist-list/playlist-list.component";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-my-playlists',
  templateUrl: './my-playlists.page.html',
  styleUrls: ['./my-playlists.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, PlaylistListComponent]
})
export class MyPlaylistsPage implements ViewWillEnter {

  myPlaylists: Playlist[] = [];

  constructor(private playlistService: PlaylistService, private userService: UserService, private router: Router, private alertController: AlertController) {}

  ionViewWillEnter() {
    this.playlistService.getMyPlaylists().subscribe((playlistsData: any) => {
      this.myPlaylists = playlistsData.playlists.map((playlistData: any) => Playlist.fromJsonWithoutCreatorAndSongs(playlistData));
    });
  }

}
