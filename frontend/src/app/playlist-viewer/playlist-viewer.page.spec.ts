import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaylistViewerPage } from './playlist-viewer.page';

describe('PlaylistViewerPage', () => {
  let component: PlaylistViewerPage;
  let fixture: ComponentFixture<PlaylistViewerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistViewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
