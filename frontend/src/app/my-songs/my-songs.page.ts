import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewWillEnter } from '@ionic/angular/standalone';
import { SongService } from '../song.service';
import { Song } from '../song.model';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { SongListComponent } from "../song-list/song-list.component";
import { AlertController, IonicModule } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';

@Component({
  selector: 'app-my-songs',
  templateUrl: './my-songs.page.html',
  styleUrls: ['./my-songs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SongListComponent, IonicSelectableComponent]
})
export class MySongsPage implements ViewWillEnter {

  mySongs: Song[] = [];
  selectedSongToDelete: Song | undefined;

  constructor(private songService: SongService, private userService: UserService, private router: Router, private alertController: AlertController) {}

  ionViewWillEnter() {
    this.songService.getMySongs().subscribe((songsData: any) => {
      this.mySongs = songsData.songs.map((songData: any) => Song.fromJson(songData));
    });
  }

  deleteSong() {
    if (this.selectedSongToDelete) {
      this.alertController.create({
        header: 'Confirm',
        message: 'Are you sure you want to delete the selected song?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Delete',
            handler: () => {
              this.songService.deleteSong(this.selectedSongToDelete!.id).subscribe({
                next: () => {
                  this.mySongs = this.mySongs.filter(song => song.id !== this.selectedSongToDelete?.id);
                  this.selectedSongToDelete = undefined;
                },
                error: () => {
                  this.alertController.create({
                    header: 'Error',
                    message: 'Error deleting song',
                    buttons: ['Ok']
                  }).then(alert => {
                    alert.present();
                  });
                }
              });
            }
          }
        ]
      }).then(alert => {
        alert.present();
      });
    } else {
      this.alertController.create({
        header: 'Error',
        message: 'No song selected for deletion',
        buttons: ['Ok']
      }).then(alert => {
        alert.present();
      });
    }
  }

}
