import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter } from '@ionic/angular/standalone';
import { Song } from '../song.model';
import { SongService } from '../song.service';
import { SongListComponent } from "../song-list/song-list.component";

@Component({
  selector: 'app-discover-songs',
  templateUrl: './discover-songs.page.html',
  styleUrls: ['./discover-songs.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, SongListComponent]
})
export class DiscoverSongsPage implements ViewWillEnter {

  randomSongs: Song[] = [];

  constructor(private songService: SongService) {}

  ionViewWillEnter() {
    this.songService.getRandomSongs(10).subscribe((songsData: any) => {
      this.randomSongs = songsData.songs.map((songData: any) => Song.fromJson(songData));
    });
  }

}
