import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-list-clientes',
  standalone: false,
  templateUrl: './list-clientes.component.html',
  styleUrl: './list-clientes.component.scss'
})
export class ListClientesComponent implements OnInit, OnDestroy {
  private deleteSubscription: Subscription | undefined;
  
  loading: boolean | undefined;
  results: any;

  cols: any[] = [];
  exportColumns: any[] = [];

  constructor(
    public fun: FunctionsService,
    public auth: AuthService,
    public crud: CrudService
  ) {}

  ngOnInit(): void {
    this.getList();
    this.subscribeToDeleteEvent();
    
    this.cols = [
      { field: "nombre", header: "Nombre" },
      { field: "paterno", header: "Apellido paterno" },
      { field: "materno", header: "Apellido materno" },
      { field: "correo_electronico", header: "Correo electrónico" },
      { field: "genero", header: "Género" },
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

    this.crud.getList('clientes').subscribe((response: any) => {
      // Ordena los resultados por la fecha de creación en orden descendente
      this.results = response.sort((a: any, b: any) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      this.results.forEach((result: any) => {
        result.createdAt = this.fun.transformDateTime2(result.createdAt);
        result.updatedAt = this.fun.transformDateTime2(result.updatedAt);
      });

      this.loading = false;
    });
  }

  confirmDelete(item: any) {
    this.crud.confirmDelete(item, 'clientes');
  }
  
  delete(item: any) {
    this.crud.delete(item, 'clientes');
  }

  subscribeToDeleteEvent() {
    this.deleteSubscription = this.crud.getDeleteObservable().subscribe(() => {
      this.getList();
    });
  }

}
