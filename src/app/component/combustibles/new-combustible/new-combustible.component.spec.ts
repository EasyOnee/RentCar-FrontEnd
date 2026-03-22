import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCombustibleComponent } from './new-combustible.component';

describe('NewCombustibleComponent', () => {
  let component: NewCombustibleComponent;
  let fixture: ComponentFixture<NewCombustibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCombustibleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewCombustibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
