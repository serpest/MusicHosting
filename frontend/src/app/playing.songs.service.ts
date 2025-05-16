import { Injectable } from '@angular/core';
import { Song } from './song.model';

@Injectable({
  providedIn: 'root'
})
export class PlayingSongsService {

  private playingSongs: Song[] = [];

  getPlayingSongs(): Song[] {
    return this.playingSongs;
  }

  setPlayingSongs(songs: Song[]): void {
    this.playingSongs = songs;
  }

}
