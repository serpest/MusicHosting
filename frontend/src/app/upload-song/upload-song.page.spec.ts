import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadSongPage } from './upload-song.page';

describe('UploadSongPage', () => {
  let component: UploadSongPage;
  let fixture: ComponentFixture<UploadSongPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSongPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
