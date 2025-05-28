import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Playlist } from './playlist.model';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getPlaylists(): Observable<any> {
    return this.http.get(`${this.baseUrl}/playlists`);
  }

  getRandomPlaylists(count: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/playlists/random/${count}`);
  }

  getPlaylistById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/playlists/id/${id}`);
  }

  getMyPlaylists(): Observable<any> {
    return this.http.get(`${this.baseUrl}/playlists/mine`);
  }

  getPlaylistSongs(playlistId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/playlists/id/${playlistId}/songs`);
  }

  getPlaylistCreator(playlistId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/playlists/id/${playlistId}/creator`);
  }

  deletePlaylist(playlistId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/playlists/id/${playlistId}`);
  }

  createPlaylist(playlist: Playlist): Observable<any> {
    return this.http.post(`${this.baseUrl}/playlists/create`, Playlist.toJson(playlist));
  }

  addSongToPlaylist(playlistId: number, songId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/playlists/id/${playlistId}/add-song`, {songId});
  }

  removeSongFromPlaylist(playlistId: number, songId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/playlists/id/${playlistId}/remove-song`, {songId});
  }

  getPlaylistLikedSongs(): Observable<any> {
    return this.http.get(`${this.baseUrl}/likes/playlist-liked-songs`);
  }

}
