import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSuplidorComponent } from './new-suplidor.component';

describe('NewSuplidorComponent', () => {
  let component: NewSuplidorComponent;
  let fixture: ComponentFixture<NewSuplidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSuplidorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewSuplidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
