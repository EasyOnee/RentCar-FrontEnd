import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClienteComponent } from './view-cliente.component';

describe('ViewClienteComponent', () => {
  let component: ViewClienteComponent;
  let fixture: ComponentFixture<ViewClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewClienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
