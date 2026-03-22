import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewModeloComponent } from './new-modelo.component';

describe('NewModeloComponent', () => {
  let component: NewModeloComponent;
  let fixture: ComponentFixture<NewModeloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewModeloComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewModeloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
