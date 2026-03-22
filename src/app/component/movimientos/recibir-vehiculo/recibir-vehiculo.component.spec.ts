import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecibirVehiculoComponent } from './recibir-vehiculo.component';

describe('RecibirVehiculoComponent', () => {
  let component: RecibirVehiculoComponent;
  let fixture: ComponentFixture<RecibirVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecibirVehiculoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecibirVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
