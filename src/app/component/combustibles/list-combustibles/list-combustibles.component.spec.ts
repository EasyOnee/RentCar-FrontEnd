import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCombustiblesComponent } from './list-combustibles.component';

describe('ListCombustiblesComponent', () => {
  let component: ListCombustiblesComponent;
  let fixture: ComponentFixture<ListCombustiblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCombustiblesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListCombustiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
