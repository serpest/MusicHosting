import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiscoverSongsPage } from './discover-songs.page';

describe('DiscoverSongsPage', () => {
  let component: DiscoverSongsPage;
  let fixture: ComponentFixture<DiscoverSongsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoverSongsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
