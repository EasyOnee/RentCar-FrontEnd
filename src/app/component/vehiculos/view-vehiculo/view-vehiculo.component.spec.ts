import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVehiculoComponent } from './view-vehiculo.component';

describe('ViewVehiculoComponent', () => {
  let component: ViewVehiculoComponent;
  let fixture: ComponentFixture<ViewVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewVehiculoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
