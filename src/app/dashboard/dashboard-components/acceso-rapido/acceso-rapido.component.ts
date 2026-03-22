import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acceso-rapido',
  templateUrl: './acceso-rapido.component.html',
  styleUrls: ['./acceso-rapido.component.css']
})
export class AccesoRapidoComponent implements OnInit {

  quickAccessItems = [
    { label: 'Vehículos', icon: 'bi bi-car-front-fill', route: '/component/vehiculos/list' },
    { label: 'Rentas', icon: 'bi bi-arrow-repeat', route: '/component/reservas/list' },
    { label: 'Clientes', icon: 'bi bi-person-fill', route: '/component/clientes/list' },
    { label: 'Recibir vehículo', icon: 'bi bi-car-front-fill', route: '/component/reservas/recibir' },
    { label: 'Ingresos generales', icon: 'bi bi-cash-stack', route: '/component/reportes' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

}
