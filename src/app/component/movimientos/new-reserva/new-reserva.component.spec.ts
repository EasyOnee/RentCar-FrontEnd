import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewReservaComponent } from './new-reserva.component';

describe('NewReservaComponent', () => {
  let component: NewReservaComponent;
  let fixture: ComponentFixture<NewReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewReservaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
