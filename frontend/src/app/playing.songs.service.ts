import { Injectable } from '@angular/core';
import { Song } from './song.model';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayingSongsService {

  private playingSongs: Song[] = [];
  public isPlaying: boolean = false;
  public currentIndex: number = -1;

  getPlayingSongs(): Song[] {
    return this.playingSongs;
  }

  setPlayingSongs(songs: Song[]): void {
    this.isPlaying = true;
    this.playingSongs = songs;
  }




}
