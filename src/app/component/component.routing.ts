// Routes
import { Routes } from '@angular/router';

// Guards
import { AuthGuard } from '../guards/auth.guard';

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
import { ListCombustiblesComponent } from './combustibles/list-combustibles/list-combustibles.component';
import { NewCombustibleComponent } from './combustibles/new-combustible/new-combustible.component';
import { ListSuplidoresComponent } from './suplidores/list-suplidores/list-suplidores.component';
import { NewSuplidorComponent } from './suplidores/new-suplidor/new-suplidor.component';
import { ListReservasComponent } from './movimientos/list-reservas/list-reservas.component';
import { NewReservaComponent } from './movimientos/new-reserva/new-reserva.component';
import { RecibirVehiculoComponent } from './movimientos/recibir-vehiculo/recibir-vehiculo.component';
import { AnularReservaComponent } from './movimientos/anular-reserva/anular-reserva.component';
import { CaptureIdComponent } from './capture-id/capture-id.component';
import { ReportesComponent } from './reportes/reportes.component';
import { InicioComponent } from './inicio/inicio.component';

export const ComponentsRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'inicio',
				component: InicioComponent,
				canActivate: [AuthGuard],
				data: { roles: ['AGENTE'] }
			},
			{
				path: 'users',
				component: UsersComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN'] }
			},
			{
				path: 'vehiculos/marcas/list',
				component: ListMarcasComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'vehiculos/marcas/new',
				component: NewMarcaComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'vehiculos/marcas/update/:id',
				component: NewMarcaComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'vehiculos/modelos/list',
				component: ListModelosComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'vehiculos/modelos/new',
				component: NewModeloComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'vehiculos/modelos/update/:id',
				component: NewModeloComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'vehiculos/tipos/list',
				component: ListTiposComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'vehiculos/tipos/new',
				component: NewTipoComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'vehiculos/tipos/update/:id',
				component: NewTipoComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'vehiculos/list',
				component: ListVehiculosComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'vehiculos/new',
				component: NewVehiculoComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'vehiculos/update/:id',
				component: NewVehiculoComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'vehiculos/view/:id',
				component: ViewVehiculoComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'vehiculos/combustibles/list',
				component: ListCombustiblesComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'vehiculos/combustibles/new',
				component: NewCombustibleComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'vehiculos/combustibles/update/:id',
				component: NewCombustibleComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'vehiculos/combustibles/suplidores/list',
				component: ListSuplidoresComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'vehiculos/combustibles/suplidores/new',
				component: NewSuplidorComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'vehiculos/combustibles/suplidores/update/:id',
				component: NewSuplidorComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'clientes/list',
				component: ListClientesComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'clientes/new',
				component: NewClienteComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'clientes/update/:id',
				component: NewClienteComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'clientes/view/:id',
				component: ViewClienteComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'clientes/capture',
				component: CaptureIdComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'reservas/list',
				component: ListReservasComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN', 'AGENTE'] }
			},
			{
				path: 'reservas/new',
				component: NewReservaComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
      {
        // Esta ruta es para cuando se crea una reserva obteniendo el id del cliente desde la url para no tener que seleccionarlo
				path: 'reservas/new/cliente/:id',
				component: NewReservaComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'reservas/recibir',
				component: RecibirVehiculoComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN', 'AGENTE'] }
			},
			{
				path: 'reservas/anular',
				component: AnularReservaComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			},
			{
				path: 'reportes',
				component: ReportesComponent,
				canActivate: [AuthGuard],
				data: { roles: ['SUPERADMIN', 'ADMIN'] }
			}
		]
	}
];
