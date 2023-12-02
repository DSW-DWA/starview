import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PlanetCreateDialogComponent} from './planet-create-dialog.component';

describe('PlanetCreateDialogComponent', () => {
  let component: PlanetCreateDialogComponent;
  let fixture: ComponentFixture<PlanetCreateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanetCreateDialogComponent]
    });
    fixture = TestBed.createComponent(PlanetCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
