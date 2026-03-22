import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-list-tipos',
  standalone: false,
  templateUrl: './list-tipos.component.html',
  styleUrl: './list-tipos.component.scss'
})
export class ListTiposComponent implements OnInit, OnDestroy {
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

    this.crud.getList('crud/tipos').subscribe((response: any) => {
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

  confirmDelete(item: any) {
    this.crud.confirmDelete(item, 'tipos');
  }
  
  delete(item: any) {
    this.crud.delete(item, 'tipos');
  }

  subscribeToDeleteEvent() {
    this.deleteSubscription = this.crud.getDeleteObservable().subscribe(() => {
      this.getList();
    });
  }

}
