import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVehiculoComponent } from './new-vehiculo.component';

describe('NewVehiculoComponent', () => {
  let component: NewVehiculoComponent;
  let fixture: ComponentFixture<NewVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewVehiculoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
