import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewWillEnter } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { Song } from '../song.model';
import { SongService } from '../song.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaylistService } from '../playlist.service';
import { SongListComponent } from "../song-list/song-list.component";
import { Playlist } from '../playlist.model';
import { UserService } from '../user.service';
import { AlertController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';

@Component({
  selector: 'app-playlist-viewer',
  templateUrl: './playlist-viewer.page.html',
  styleUrls: ['./playlist-viewer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SongListComponent, IonicSelectableComponent]
})
export class PlaylistViewerPage implements ViewWillEnter {

  isExisting: boolean = false;
  isMine: boolean = false;
  playlist: Playlist | undefined;
  playlistCreator: string | undefined;
  allSongs: Song[] = [];
  selectedSongToAdd: Song | undefined;
  selectedSongToRemove: Song | undefined;

  constructor(private playlistService: PlaylistService, private songService: SongService, private userService: UserService, private route: ActivatedRoute, private alertController: AlertController, private router: Router) {}

  ionViewWillEnter() {
    this.route.params.subscribe(data => {
      
      if (data['playlistId'] === '-1') {
        this.caricaLikedSongs();
      }else{
        this.caricaPlaylist(data['playlistId']);
      }
    });
  }

  caricaPlaylist(playlistId: number) {
    this.playlistService.getPlaylistById(playlistId).subscribe({
        next: (playlistData: any) => {
          this.isExisting = true;
          this.playlist = Playlist.fromJsonWithoutSongs(playlistData.playlist);
          this.playlistService.getPlaylistSongs(playlistId).subscribe({
            next: (songsData: any) => {
              this.playlist!.songs = songsData.songs.map((songData: any) => Song.fromJson(songData));
            },
            error: () => {
              this.playlist!.songs = [];
            }
          });
          this.playlistService.getPlaylistCreator(playlistId).subscribe({
            next: (creatorData: any) => {
              this.playlistCreator = creatorData.creator.name;
            },
            error: () => {
              this.playlistCreator = 'Unknown';
            }
          });
          this.userService.validateToken().subscribe({
            next: (data) => {
              this.isMine = (this.playlist!.creatorId === data.userId);
              if (this.isMine) {
                this.songService.getSongs().subscribe({
                  next: (songsData: any) => {
                    this.allSongs = songsData.songs.map((songData: any) => Song.fromJson(songData));
                  }
                });
              }
            },
            error: () => {
              this.isMine = false;
            }
          });
        },
        error: () => {
          this.isExisting = false;
          this.isMine = false;
        }
      });
  }

  caricaLikedSongs() {
    this.playlistService.getPlaylistLikedSongs().subscribe({
      next: (songsData: any) => {
        //console.log("ho preso tutte le canzoni");
        this.playlist = new Playlist(-1, 'Liked Songs', 0);
        this.playlist!.songs = songsData.songs.map((songData: any) => Song.fromJson(songData));
        //console.log("Errore");
      },
      error: () => {
        this.playlist!.songs = [];
      }
    });
    this.playlistCreator = 'Liked Songs';
    this.isExisting = true;
    this.isMine = true;
    this.userService.validateToken().subscribe({
      next: (data) => {
        this.isMine = true;
        this.songService.getSongs().subscribe({
          next: (songsData: any) => {
            this.allSongs = songsData.songs.map((songData: any) => Song.fromJson(songData));
          }
        });
      },
      error: () => {
        this.isMine = false;
      }
    });
  }

  deletePlaylist() {
    this.alertController.create({
      header: 'Delete playlist',
      message: 'Are you sure that you want to delete this playlist?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.playlistService.deletePlaylist(this.playlist!.id).subscribe({
              next: () => {
                this.router.navigate(['']);
              },
              error: () => {
                this.alertController.create({
                  header: 'Error',
                  message: 'Failed to delete playlist',
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
  }

  addSongToPlaylist() {
    if (this.selectedSongToAdd) {
      this.playlistService.addSongToPlaylist(this.playlist!.id, this.selectedSongToAdd.id).subscribe({
        next: () => {
          this.playlist!.songs.push(this.selectedSongToAdd!);
          this.selectedSongToAdd = undefined;
        },
        error: (error) => {
          if (error.status === 409) {
            this.alertController.create({
              header: 'Error',
              message: 'Song already in playlist',
              buttons: ['Ok']
            }).then(alert => {
              alert.present();
            });
          } else {
            this.alertController.create({
              header: 'Error',
              message: 'Failed to add song to playlist',
              buttons: ['Ok']
            }).then(alert => {
              alert.present();
            });
          }
        }
      });
    } else {
      this.alertController.create({
        header: 'Error',
        message: 'No song selected',
        buttons: ['Ok']
      }).then(alert => {
        alert.present();
      });
    }
  }

  removeSongFromPlaylist() {
    if (this.selectedSongToRemove) {
      this.playlistService.removeSongFromPlaylist(this.playlist!.id, this.selectedSongToRemove.id).subscribe({
        next: () => {
          this.playlist!.songs = this.playlist!.songs.filter(song => song.id !== this.selectedSongToRemove!.id);
          this.selectedSongToRemove = undefined;
        },
        error: () => {
          this.alertController.create({
            header: 'Error',
            message: 'Failed to remove song from playlist',
            buttons: ['Ok']
          }).then(alert => {
            alert.present();
          });
        }
      });
    } else {
      this.alertController.create({
        header: 'Error',
        message: 'No song selected',
        buttons: ['Ok']
      }).then(alert => {
        alert.present();
      });
    }
  }

}
