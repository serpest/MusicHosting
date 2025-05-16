import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MySongsPage } from './my-songs.page';

describe('MySongsPage', () => {
  let component: MySongsPage;
  let fixture: ComponentFixture<MySongsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MySongsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
