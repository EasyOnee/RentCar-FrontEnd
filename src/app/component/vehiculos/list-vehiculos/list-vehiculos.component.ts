import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-list-vehiculos',
  standalone: false,
  templateUrl: './list-vehiculos.component.html',
  styleUrl: './list-vehiculos.component.scss'
})
export class ListVehiculosComponent implements OnInit, OnDestroy {
  private deleteSubscription: Subscription | undefined;
  
  loading: boolean | undefined;
  results: any;

  dataVehicle: [] = [];

  cols: any[] = [];
  exportColumns: any[] = [];

  vehiculosEstados = {
    DISPONIBLE: 0,
    MANTENIMIENTO: 0,
    REPARACION: 0,
    NO_DISPONIBLE: 0,
    RESERVADO: 0,
    ALQUILADO: 0
  };

  constructor(
    public fun: FunctionsService,
    public auth: AuthService,
    public crud: CrudService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getList();
    this.getVehiculosEstado();
    this.subscribeToDeleteEvent();
    
    this.cols = [
      { field: "num_serie", header: "Número de serie" },
      { field: "placa", header: "Placa" },
      { field: "marca", header: "Marca" },
      { field: "modelo", header: "Modelo" },
      { field: "ano", header: "Año" },
      { field: "createdAt", header: "Creado el" },
      { field: "updatedAt", header: "Actualizado el" }
    ];

    this.exportColumns = this.cols.map(col => ({
      title: col.header,
      dataKey: col.field
    }));
  }

  ngOnDestroy(): void {
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }

  getList() {
    this.loading = true;

    this.crud.getList('vehiculos').subscribe((response: any) => {
      // Ordena los resultados por la fecha de actualización en orden descendente
      this.results = response.sort((a: any, b: any) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });

      this.results.forEach((result: any) => {
        result.createdAt = this.fun.transformDateTime2(result.createdAt);
        result.updatedAt = this.fun.transformDateTime2(result.updatedAt);
      });

      this.loading = false;
    });
  }

  getVehiculosEstado() {
    this.crud.getList('vehiculos/estado').subscribe((response: any) => {
      this.vehiculosEstados = response;
    });
  }

  confirmDelete(item: any) {
    this.crud.confirmDelete(item, 'vehiculos');
  }
  
  delete(item: any) {
    this.crud.delete(item, 'vehiculos');
  }

  subscribeToDeleteEvent() {
    this.deleteSubscription = this.crud.getDeleteObservable().subscribe(() => {
      this.getList();
    });
  }

  onClick(id: any) {
    this.router.navigateByUrl(`component/vehiculos/update/${id}`);
  }

  getIdVehicle(id: any) {
    this.crud.getList(`vehiculos/${id}`).subscribe((response: any) => {
      this.router.navigate(['/component/vehiculos/view', response.id]);
      this.dataVehicle = response;
    });
  }
  

}
