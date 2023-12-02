import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConstellationCreateDialogComponent} from './constellation-create-dialog.component';

describe('ConstellationCreateDialogComponent', () => {
  let component: ConstellationCreateDialogComponent;
  let fixture: ComponentFixture<ConstellationCreateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConstellationCreateDialogComponent]
    });
    fixture = TestBed.createComponent(ConstellationCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
