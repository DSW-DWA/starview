import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UniverseCreateDialogComponent} from './universe-create-dialog.component';

describe('UniverseCreateDialogComponent', () => {
  let component: UniverseCreateDialogComponent;
  let fixture: ComponentFixture<UniverseCreateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UniverseCreateDialogComponent]
    });
    fixture = TestBed.createComponent(UniverseCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
