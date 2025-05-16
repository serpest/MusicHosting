import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyPlaylistsPage } from './my-playlists.page';

describe('MyPlaylistsPage', () => {
  let component: MyPlaylistsPage;
  let fixture: ComponentFixture<MyPlaylistsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPlaylistsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
