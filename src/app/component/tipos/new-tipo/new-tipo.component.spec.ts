import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTipoComponent } from './new-tipo.component';

describe('NewTipoComponent', () => {
  let component: NewTipoComponent;
  let fixture: ComponentFixture<NewTipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTipoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewTipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
