import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalaxyCreateDialogComponent } from './galaxy-create-dialog.component';

describe('GalaxyCreateDialogComponent', () => {
  let component: GalaxyCreateDialogComponent;
  let fixture: ComponentFixture<GalaxyCreateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GalaxyCreateDialogComponent]
    });
    fixture = TestBed.createComponent(GalaxyCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
