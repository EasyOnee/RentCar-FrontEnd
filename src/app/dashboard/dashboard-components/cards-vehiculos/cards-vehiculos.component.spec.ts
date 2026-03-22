/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CardsVehiculosComponent } from './cards-vehiculos.component';

describe('CardsVehiculosComponent', () => {
  let component: CardsVehiculosComponent;
  let fixture: ComponentFixture<CardsVehiculosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardsVehiculosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsVehiculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
