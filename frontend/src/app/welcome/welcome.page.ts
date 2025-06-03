import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { SongService } from '../song.service';
import { Song } from '../song.model';
import { SongListComponent } from '../song-list/song-list.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterModule, SongListComponent]
})
export class WelcomePage implements ViewWillEnter {

  mostLikedSongs : Song[] = [];

  constructor(private songService: SongService) { }

  ionViewWillEnter() {
    this.songService.getMostLikedSongs(6).subscribe((songsData: any) => {
      this.mostLikedSongs = songsData.songs.map((songData: any) => Song.fromJson(songData));
    });
  }

}
