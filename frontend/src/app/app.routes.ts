import { Routes } from '@angular/router';
import { tokenGuard } from './token.guard';

export const routes: Routes = [
  {
    path: 'about',
    loadComponent: () => import('./about/about.page').then( m => m.AboutPage)
  },
  {
    path: 'create-playlist',
    loadComponent: () => import('./create-playlist/create-playlist.page').then( m => m.CreatePlaylistPage),
    canActivate: [tokenGuard]
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
    loadComponent: () => import('./manage-account/manage-account.page').then( m => m.ManageAccountPage),
    canActivate: [tokenGuard]
  },
  {
    path: 'my-playlists',
    loadComponent: () => import('./my-playlists/my-playlists.page').then( m => m.MyPlaylistsPage),
    canActivate: [tokenGuard]
  },
  {
    path: 'my-songs',
    loadComponent: () => import('./my-songs/my-songs.page').then( m => m.MySongsPage),
    canActivate: [tokenGuard]
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
    loadComponent: () => import('./song-player/song-player.page').then( m => m.SongPlayerPage),
    canActivate: [tokenGuard]
  },
  {
    path: 'playlist-viewer/:playlistId',
    loadComponent: () => import('./playlist-viewer/playlist-viewer.page').then( m => m.PlaylistViewerPage),
    canActivate: [tokenGuard]
  },
  {
    path: 'upload-song',
    loadComponent: () => import('./upload-song/upload-song.page').then( m => m.UploadSongPage),
    canActivate: [tokenGuard]
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
    path: 'auth/reset-password',
    loadComponent: () => import('./reset-password/reset-password.page').then( m => m.ResetPasswordPage)
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
  },
  {
    path: '**',
    redirectTo: 'page-not-found'
  },

];
