import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnularReservaComponent } from './anular-reserva.component';

describe('AnularReservaComponent', () => {
  let component: AnularReservaComponent;
  let fixture: ComponentFixture<AnularReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnularReservaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnularReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
