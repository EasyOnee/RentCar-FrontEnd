import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSuplidoresComponent } from './list-suplidores.component';

describe('ListSuplidoresComponent', () => {
  let component: ListSuplidoresComponent;
  let fixture: ComponentFixture<ListSuplidoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSuplidoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListSuplidoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
