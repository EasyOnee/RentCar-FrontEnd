import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { NgApexchartsModule } from "ng-apexcharts";

// PrimeNG
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RippleModule } from 'primeng/ripple';
import { DividerModule } from 'primeng/divider';
import { ChartModule } from 'primeng/chart';

// FullCalendar
import { FullCalendarModule } from '@fullcalendar/angular'; // Módulo de Angular para FullCalendar

// Components
import { DashboardComponent } from "./dashboard.component";
import { FeedsComponent } from "./dashboard-components/feeds/feeds.component";
import { TopCardsComponent } from "./dashboard-components/top-cards/top-cards.component";
import { BienvenidaComponent } from "./dashboard-components/bienvenida/bienvenida.component";
import { AccesoRapidoComponent } from "./dashboard-components/acceso-rapido/acceso-rapido.component";
import { CardsVehiculosComponent } from "./dashboard-components/cards-vehiculos/cards-vehiculos.component";
import { CalendarioReservasComponent } from "./dashboard-components/calendario-reservas/calendario-reservas.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Dashboard",
      urls: [{ title: "Dashboard", url: "/dashboard" }, { title: "Dashboard" }],
    },
    component: DashboardComponent
  }
];

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    NgApexchartsModule,
    BreadcrumbModule,
    RippleModule,
    DividerModule,
    ChartModule,
    FullCalendarModule
  ],
  declarations: [
    DashboardComponent,
    FeedsComponent,
    TopCardsComponent,
    BienvenidaComponent,
    AccesoRapidoComponent,
    CardsVehiculosComponent,
    CalendarioReservasComponent
  ],
})
export class DashboardModule {}
