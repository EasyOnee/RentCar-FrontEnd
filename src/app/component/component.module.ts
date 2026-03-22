import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsRoutes } from './component.routing';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion'
import { SelectButtonModule } from 'primeng/selectbutton'
import { MessagesModule } from 'primeng/messages';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { TabMenuModule } from 'primeng/tabmenu';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { FileUploadModule } from 'primeng/fileupload';
import { WebcamModule } from 'ngx-webcam';
import { ProgressBarModule } from 'primeng/progressbar';

// Google Maps
import { GoogleMapsModule } from '@angular/google-maps';

// Components
import { UsersComponent } from './users/users.component';
import { ListMarcasComponent } from './marcas/list-marcas/list-marcas.component';
import { NewMarcaComponent } from './marcas/new-marca/new-marca.component';
import { ListModelosComponent } from './modelos/list-modelos/list-modelos.component';
import { NewModeloComponent } from './modelos/new-modelo/new-modelo.component';
import { ListTiposComponent } from './tipos/list-tipos/list-tipos.component';
import { NewTipoComponent } from './tipos/new-tipo/new-tipo.component';
import { ListVehiculosComponent } from './vehiculos/list-vehiculos/list-vehiculos.component';
import { NewVehiculoComponent } from './vehiculos/new-vehiculo/new-vehiculo.component';
import { ViewVehiculoComponent } from './vehiculos/view-vehiculo/view-vehiculo.component';
import { ListClientesComponent } from './clientes/list-clientes/list-clientes.component';
import { NewClienteComponent } from './clientes/new-cliente/new-cliente.component';
import { ViewClienteComponent } from './clientes/view-cliente/view-cliente.component';
import { RecibirVehiculoComponent } from './movimientos/recibir-vehiculo/recibir-vehiculo.component';
import { AnularReservaComponent } from './movimientos/anular-reserva/anular-reserva.component';
import { ListCombustiblesComponent } from './combustibles/list-combustibles/list-combustibles.component';
import { NewCombustibleComponent } from './combustibles/new-combustible/new-combustible.component';
import { ListSuplidoresComponent } from './suplidores/list-suplidores/list-suplidores.component';
import { NewSuplidorComponent } from './suplidores/new-suplidor/new-suplidor.component';
import { ListReservasComponent } from './movimientos/list-reservas/list-reservas.component';
import { NewReservaComponent } from './movimientos/new-reserva/new-reserva.component';
import { CaptureIdComponent } from './capture-id/capture-id.component';
import { ReportesComponent } from './reportes/reportes.component';

// Pipes
import { TruncatePipe } from '../pipes/truncate.pipe';
import { InicioComponent } from './inicio/inicio.component';

@NgModule({
  imports: [
    ButtonModule,
    ToastModule,
    CommonModule,
    RouterModule.forChild(ComponentsRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DropdownModule,
    ColorPickerModule,
    FullCalendarModule,
    DividerModule,
    DialogModule,
    DropdownModule,
    AccordionModule,
    SelectButtonModule,
    MessagesModule,
    ToolbarModule,
    TableModule,
    TooltipModule,
    TabMenuModule,
    CalendarModule,
    ChartModule,
    FileUploadModule,
    WebcamModule,
    GoogleMapsModule,
    ProgressBarModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    // Pipes
    TruncatePipe,
    //-//
    InicioComponent,
    UsersComponent,
    ListMarcasComponent,
    NewMarcaComponent,
    ListTiposComponent,
    NewTipoComponent,
    ListModelosComponent,
    NewModeloComponent,
    ListVehiculosComponent,
    NewVehiculoComponent,
    ViewVehiculoComponent,
    ListClientesComponent,
    NewClienteComponent,
    ViewClienteComponent,
    ListCombustiblesComponent,
    NewCombustibleComponent,
    ListSuplidoresComponent,
    NewSuplidorComponent,
    ListReservasComponent,
    NewReservaComponent,
    RecibirVehiculoComponent,
    AnularReservaComponent,
    CaptureIdComponent,
    ReportesComponent
  ]
})
export class ComponentsModule { }
