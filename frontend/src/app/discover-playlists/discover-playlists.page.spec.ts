import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiscoverPlaylistsPage } from './discover-playlists.page';

describe('DiscoverPlaylistsPage', () => {
  let component: DiscoverPlaylistsPage;
  let fixture: ComponentFixture<DiscoverPlaylistsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoverPlaylistsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
