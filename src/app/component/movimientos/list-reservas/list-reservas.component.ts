import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-reservas',
  standalone: false,
  templateUrl: './list-reservas.component.html',
  styleUrl: './list-reservas.component.scss'
})
export class ListReservasComponent implements OnInit, OnDestroy {
  private deleteSubscription: Subscription | undefined;
  
  loading: boolean | undefined;
  results: any;

  cols: any[] = [];
  exportColumns: any[] = [];

  selectedReserva: any = null;
  showConsultaModal: boolean = false;

  currentUser: any; // Propiedad para el usuario autenticado

  constructor(
    public fun: FunctionsService,
    public auth: AuthService,
    public crud: CrudService,
    private authService: AuthService

  ) {
    this.currentUser = this.authService.getCurrentUser(); // Obtener usuario autenticado desde un servicio
  }

  ngOnInit(): void {
    this.getList();
    this.subscribeToDeleteEvent();
    
    this.cols = [
      { field: "cliente", header: "Cliente" },
      { field: "createdAt", header: "Fecha de registró" },
      { field: "folio", header: "Folio" },
      { field: "fecha_salida", header: "Salida" },
      { field: "fecha_llegada", header: "Retorno" },
      { field: "tipo_transaccion", header: "Tipo" }
      //{ field: "vehiculo", header: "Vehículo" }
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

  openConsultaModal(reserva: any): void {
    this.showConsultaModal = true;

    this.crud.getList(`reservas/detalle/${reserva.id}`).subscribe((response: any) => {
        response.createdAt = this.fun.transformDateTime2(response.createdAt);
        response.fecha_salida = this.fun.transformDateTime2(response.fecha_salida);
        response.fecha_llegada = this.fun.transformDateTime2(response.fecha_llegada);

        this.selectedReserva = response;
    });
  }

  generateRecibo(): void {
    if (this.selectedReserva) {
      this.crud.getList(`reservas/generar-recibo/${this.selectedReserva.folio}`).subscribe((response: any) => {
        if (response && response.pdf) {
          // Crear un Blob con el PDF en base64
          const byteCharacters = atob(response.pdf);
          const byteNumbers = new Array(byteCharacters.length);
          
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });

          // Crear un enlace y simular clic para abrir el PDF en una nueva pestaña
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.click();

          // Liberar la URL del Blob
          window.URL.revokeObjectURL(url);
        }
      }, (error) => {
        console.error('Error al generar el recibo:', error);
      });
    }
  }

  generatePagare(): void {
    if (this.selectedReserva) {
      this.crud.getList(`reservas/generar-pagare/${this.selectedReserva.folio}`).subscribe((response: any) => {
        if (response && response.pagare) {
          // Crear un Blob con el PDF en base64
          const byteCharacters = atob(response.pagare);
          const byteNumbers = new Array(byteCharacters.length);
          
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });

          // Crear un enlace y simular clic para abrir el PDF en una nueva pestaña
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.click();

          // Liberar la URL del Blob
          window.URL.revokeObjectURL(url);
        }
      }, (error) => {
        console.error('Error al generar el pagaré:', error);
      });
    }
  }

  showSeriePlaca(reserva: any): void {
    alert(`Número de serie: ${reserva.vehiculo.num_serie} - Placa: ${reserva.vehiculo.placa}`);
  }

  closeConsultaModal(): void {
    this.showConsultaModal = false;
    this.selectedReserva = null;
  }

  getList() {
    this.loading = true;

    this.crud.getList('reservas').subscribe((response: any) => {
      // Ordena los resultados por la fecha de creación en orden descendente
      this.results = response.sort((a: any, b: any) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      this.results.forEach((result: any) => {
        result.createdAt = this.fun.transformDateTime2(result.createdAt);
        result.fecha_salida = this.fun.transformDateTime2(result.fecha_salida);
        result.fecha_llegada = this.fun.transformDateTime2(result.fecha_llegada);
      });

      this.loading = false;
    });
  }

//Cambiar estado del vehiculo para liberarlo
cambiarEstadoVehiculo(vehiculoId: number, folio: string): void {
  Swal.fire({
    title: "¿Estás segur@?",
    text: "Una vez liberado, no podrás revertir los cambios.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Ingrese los kilómetros de salida",
        input: 'number',
        inputPlaceholder: 'Por favor, ingrese los kilómetros de salida',
        inputAttributes: {
          min: '0',
          step: '0.1' 
        },
        showCancelButton: true,
        confirmButtonText: 'Siguiente',
        cancelButtonText: 'Cancelar',
      }).then((kmsResult) => {
        if (kmsResult.isConfirmed && kmsResult.value !== null) {
          const kmsSalida = kmsResult.value;
            Swal.fire({
            title: "Seleccione el nivel de combustible",
            input: 'select',
            inputOptions: {
              'E': 'E (Vacío)',
              '1/4': '1/4',
              '1/2': '1/2',
              '3/4': '3/4',
              'F': 'F (Lleno)'
            },
            inputPlaceholder: 'Por favor, seleccione el nivel de combustible',
            showCancelButton: true,
            confirmButtonText: 'Liberar vehículo',
            cancelButtonText: 'Cancelar',
          }).then((combustibleResult) => {
            if (combustibleResult.isConfirmed && combustibleResult.value !== null) {
              const combustibleSalida = combustibleResult.value;

              // Datos para enviar
              const data = {
                folio: folio,
                estado: 'ALQUILADO',
                kms_salida: kmsSalida,
                combustible_salida: combustibleSalida,
              };

              this.crud.save('reservas/cambiarEstado', data).subscribe({
                next: (response: any) => {
                  Swal.fire({
                    title: 'Estado actualizado',
                    text: 'El estado del vehículo ha sido cambiado a "ALQUILADO".',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                  }).then(() => {
                    this.getList();
                  });
                },
                error: (error: any) => {
                  console.error('Error al actualizar el estado del vehículo:', error);
                  Swal.fire({
                    title: 'Error',
                    text: 'No se pudo actualizar el estado del vehículo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                  });
                }
              });
              const temp = {
                usuario_id: this.currentUser.id,
                folioReserva: folio,
              }
              this.crud.save('bitacoraRecibir/guardar', temp).subscribe({
                next: (response: any) => {
                  this.getList();
                },
                error: (error: any) => {
                  console.error('Error al recibir el vehículo:', error);
                },
              });
            }
          });
        }
      });
    }
  });
}

  confirmDelete(item: any) {
    this.crud.confirmDelete(item, 'reservas');
  }
  
  delete(item: any) {
    this.crud.delete(item, 'reservas');
  }

  subscribeToDeleteEvent() {
    this.deleteSubscription = this.crud.getDeleteObservable().subscribe(() => {
      this.getList();
    });
  }
}
