import { Component, AfterViewInit, OnInit } from '@angular/core';

@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  subtitle: string;

  constructor() {
    this.subtitle = 'This is some text within a card block.';
  }

  ngOnInit(): void { }

  ngAfterViewInit() { }
  
}
