import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListModelosComponent } from './list-modelos.component';

describe('ListModelosComponent', () => {
  let component: ListModelosComponent;
  let fixture: ComponentFixture<ListModelosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListModelosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListModelosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
