import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StarCreateDialogComponent} from './star-create-dialog.component';

describe('StarCreateDialogComponent', () => {
  let component: StarCreateDialogComponent;
  let fixture: ComponentFixture<StarCreateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StarCreateDialogComponent]
    });
    fixture = TestBed.createComponent(StarCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
