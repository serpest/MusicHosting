import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Song } from './song.model';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getSongs(): Observable<any> {
    return this.http.get(`${this.baseUrl}/songs`);
  }

  getRandomSongs(count: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/songs/random/${count}`);
  }

  getSongById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/songs/id/${id}`);
  }

  getMySongs(): Observable<any> {
    return this.http.get(`${this.baseUrl}/songs/mine`);
  }

  searchSongs(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/songs/search/${query}`);
  }

  submitSong(song: Song): Observable<any> {
    return this.http.post(`${this.baseUrl}/songs/submit`, Song.toJson(song));
  }

  submitSongAudio(songId: number, file: File): Observable<any> {
    return this.http.post(`${this.baseUrl}/songs/id/${songId}/audio`, file);
  }

  submitSongAlbumPicture(songId: number, file: File): Observable<any> {
    return this.http.post(`${this.baseUrl}/songs/id/${songId}/album-picture`, file);
  }

  deleteSong(songId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/songs/id/${songId}`);
  }

  isSongLiked(songId: number): Observable<{ liked: boolean }> {
    return this.http.get<{ liked: boolean }>(`${this.baseUrl}/likes/${songId}/is-liked`);
  }

  likeSong(songId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/likes/${songId}/like`, {});
  }

  unlikeSong(songId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/likes/${songId}/unlike`, {});
  }

}
