import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Song } from '../song.model';
import { SongService } from '../song.service';
import { SongListComponent } from "../song-list/song-list.component";

@Component({
  selector: 'app-search-songs',
  templateUrl: './search-songs.page.html',
  styleUrls: ['./search-songs.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, SongListComponent]
})
export class SearchSongsPage {

  searchQuery: string = '';
  songs: Song[] = [];

  constructor(private songService: SongService) {}

  search() {
    this.songService.searchSongs(this.searchQuery).subscribe({
      next: (songsData) => {
        this.songs = songsData.songs.map((songData: any) => Song.fromJson(songData));
      },
      error: () => {
        this.songs = [];
      }
    });
  }

}
