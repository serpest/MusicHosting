import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SongPlayerPage } from './song-player.page';

describe('SongPlayerPage', () => {
  let component: SongPlayerPage;
  let fixture: ComponentFixture<SongPlayerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SongPlayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
