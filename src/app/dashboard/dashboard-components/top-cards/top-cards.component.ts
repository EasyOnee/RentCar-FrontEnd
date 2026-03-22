import { Component, OnInit } from '@angular/core';
import { topcard, topcards } from './top-cards-data';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-top-cards',
  templateUrl: './top-cards.component.html'
})
export class TopCardsComponent implements OnInit {

  topcards: topcard[];

  constructor(private crud: CrudService) {
    this.topcards = topcards;
  }

  ngOnInit(): void {
    this.updateCardData();
  }

  updateCardData(): void {
    // Actualiza el número de vehículos registrados
    this.crud.getList('vehiculos/total').subscribe((response: any) => {
      this.topcards[0].title = response.total.toString(); // Vehículos registrados
    });

    // Actualiza el monto total de reservas con formato
    this.crud.getList('reservas/monto').subscribe((response: any) => {
      this.topcards[1].title = this.formatCurrency(response.total); // Monto total de reservas
    });

    // Actualiza el número de clientes registrados
    this.crud.getList('clientes/total').subscribe((response: any) => {
      this.topcards[2].title = response.total.toString(); // Clientes registrados
    });

    // Actualiza el número de reservas totales
    this.crud.getList('reservas/total').subscribe((response: any) => {
      this.topcards[3].title = response.total.toString(); // Reservas totales
    });

  }

  formatCurrency(amount: number): string {
    return `$ ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  }
  
  
}
