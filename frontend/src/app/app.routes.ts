import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'about',
    loadComponent: () => import('./about/about.page').then( m => m.AboutPage)
  },
  {
    path: 'create-playlist',
    loadComponent: () => import('./create-playlist/create-playlist.page').then( m => m.CreatePlaylistPage)
  },
  {
    path: 'discover-playlists',
    loadComponent: () => import('./discover-playlists/discover-playlists.page').then( m => m.DiscoverPlaylistsPage)
  },
  {
    path: 'discover-songs',
    loadComponent: () => import('./discover-songs/discover-songs.page').then( m => m.DiscoverSongsPage)
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'manage-account',
    loadComponent: () => import('./manage-account/manage-account.page').then( m => m.ManageAccountPage)
  },
  {
    path: 'my-playlists',
    loadComponent: () => import('./my-playlists/my-playlists.page').then( m => m.MyPlaylistsPage)
  },
  {
    path: 'my-songs',
    loadComponent: () => import('./my-songs/my-songs.page').then( m => m.MySongsPage)
  },
  {
    path: 'search-songs',
    loadComponent: () => import('./search-songs/search-songs.page').then( m => m.SearchSongsPage)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'song-player/:songId',
    loadComponent: () => import('./song-player/song-player.page').then( m => m.SongPlayerPage)
  },
  {
    path: 'playlist-viewer/:playlistId',
    loadComponent: () => import('./playlist-viewer/playlist-viewer.page').then( m => m.PlaylistViewerPage)
  },
  {
    path: 'upload-song',
    loadComponent: () => import('./upload-song/upload-song.page').then( m => m.UploadSongPage)
  },
  {
    path: 'page-not-found',
    loadComponent: () => import('./page-not-found/page-not-found.page').then( m => m.PageNotFoundPage)
  },
  {
    path: 'welcome',
    loadComponent: () => import('./welcome/welcome.page').then( m => m.WelcomePage)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'welcome',
  },
  {
    path: 'auth',
    pathMatch: 'full',
    redirectTo: 'auth/login'
  },
  {
    path: '**',
    redirectTo: 'page-not-found'
  },
];
