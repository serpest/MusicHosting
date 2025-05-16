import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePlaylistPage } from './create-playlist.page';

describe('CreatePlaylistPage', () => {
  let component: CreatePlaylistPage;
  let fixture: ComponentFixture<CreatePlaylistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePlaylistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
