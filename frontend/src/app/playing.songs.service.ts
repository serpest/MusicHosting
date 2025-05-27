import { Injectable } from '@angular/core';
import { Song } from './song.model';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayingSongsService {

  private audio: HTMLAudioElement = new Audio();

  private isMiniPlayerDisplayed = new BehaviorSubject<boolean>(false);
  isMiniPlayerDisplayedObservable: Observable<boolean> = this.isMiniPlayerDisplayed.asObservable();

  private isPlaying = new BehaviorSubject<boolean>(false);
  isPlayingObservable: Observable<boolean> = this.isPlaying.asObservable();

  private playingIndex = new BehaviorSubject<number>(0);
  playingIndexObservable: Observable<number> = this.playingIndex.asObservable();

  private playingSongs = new BehaviorSubject<Song[]>([]);
  playingSongsObservable: Observable<Song[]> = this.playingSongs.asObservable();

  getAudio(): HTMLAudioElement {
    return this.audio;
  }

  setAudio(audio: HTMLAudioElement): void {
    this.audio = audio;
  }

  getIsMiniPlayerDisplayed(): boolean {
    return this.isMiniPlayerDisplayed.getValue();
  }

  getIsMiniPlayerDisplayedObservable(): Observable<boolean> {
    return this.isMiniPlayerDisplayedObservable;
  }

  setIsMiniPlayerDisplayed(isDisplayed: boolean): void {
    this.isMiniPlayerDisplayed.next(isDisplayed);
  }

  getPlayingSongs(): Song[] {
    return this.playingSongs.getValue();
  }

  getPlayingSongsObservable() {
    return this.playingSongsObservable;
  }

  setPlayingSongs(songs: Song[]): void {
    this.playingSongs.next(songs);
  }

  getPlayingIndex(): number {
    return this.playingIndex.getValue();
  }

  getPlayingIndexObservable() {
    return this.playingIndexObservable;
  }

  setPlayingIndex(index: number): void {
    this.playingIndex.next(index);
  }

  getIsPlaying(): boolean {
    return this.isPlaying.getValue();
  }

  getIsPlayingObservable() {
    return this.isPlayingObservable;
  }

  setIsPlaying(isPlaying: boolean): void {
    this.isPlaying.next(isPlaying);
  }

  getPlayingSong(): Song | undefined {
    const index = this.getPlayingIndex();
    const songs = this.getPlayingSongs();
    if (index >= 0 && index < songs.length) {
      return songs[index];
    }
    return undefined;
  }

}
