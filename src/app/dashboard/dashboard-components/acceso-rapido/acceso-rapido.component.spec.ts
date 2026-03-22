/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AccesoRapidoComponent } from './acceso-rapido.component';

describe('AccesoRapidoComponent', () => {
  let component: AccesoRapidoComponent;
  let fixture: ComponentFixture<AccesoRapidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccesoRapidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccesoRapidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
