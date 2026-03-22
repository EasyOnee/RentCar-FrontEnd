import { ChangeDetectorRef, Component } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-anular-reserva',
  standalone: false,
  templateUrl: './anular-reserva.component.html',
  styleUrl: './anular-reserva.component.scss'
})
export class AnularReservaComponent {
  private subscription: Subscription = new Subscription();

  displayDialog: boolean = false;
  reservas: any[] = [];
  selectedReserva: any;

  currentUser: any; 

  constructor(
    private crud: CrudService,
    private fun: FunctionsService,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.getReservas();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getReservas(): void {
    this.crud.getList('anular/activas').subscribe({
      next: (response: any) => {
        this.reservas = response.sort((a: any, b: any) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        this.cdRef.detectChanges();
      },
      error: (error: any) => {
        console.error('Error al obtener las reservas:', error);
      },
    });
    
  }

  showDialog(reserva: any) {
    if (!reserva) {
      console.error('No se pudo seleccionar la reserva.');
      Swal.fire({
        title: 'Error',
        text: 'No se pudo seleccionar la reserva para anular.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    this.selectedReserva = reserva;  // Seleccionar la reserva para anulación
    this.displayDialog = true;
    this.showConfirmAlert();
  }

  showConfirmAlert() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, anular reserva',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showReasonInput();
      }
    });
  }

  showReasonInput() {
    Swal.fire({
      title: 'Motivo de Anulación',
      input: 'text',
      inputLabel: 'Ingrese el motivo de la anulación',
      inputPlaceholder: 'Motivo de la anulación',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      preConfirm: (inputValue) => {
        if (!inputValue) {
          Swal.showValidationMessage('El motivo es requerido');
        }
        return inputValue;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const motivoAnulacion = result.value;  // Capturar el motivo ingresado
        this.anularReserva(motivoAnulacion);
      }
    });
  }

  anularReserva(motivoAnulacion: string) {
    if (!this.selectedReserva || !this.selectedReserva.folio) {
      console.error('No se ha seleccionado una reserva válida.');
      Swal.fire({
        title: 'Error',
        text: 'No se pudo anular la reserva porque no se ha seleccionado una reserva válida.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    Swal.fire({
      title: 'Anulando reserva...',
      didOpen: () => {
        Swal.showLoading(); // Mostrar un indicador de carga
      }
    });

    const data = {
      folio: this.selectedReserva.folio,
      motivoAnulacion: motivoAnulacion,
      usuario_id: this.currentUser?.id || null
    };

    if (!data.usuario_id) {
      console.error('El usuario no está definido.');
      Swal.fire({
        title: 'Error',
        text: 'No se pudo anular la reserva porque el usuario no está definido.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    this.crud.save('anular/reserva', data).subscribe({
      next: (response: any) => {
        Swal.close(); // Cerrar el indicador de carga
        this.displayDialog = false;
        Swal.fire({
          title: 'Reserva Anulada',
          text: 'La reserva ha sido anulada con éxito.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          this.getReservas();  // Actualizar la lista de reservas
        });
      },
      error: (error: any) => {
        Swal.close(); // Cerrar el indicador de carga en caso de error
        console.error('Error al anular la reserva:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo anular la reserva. Intente nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      },
    });
  }

  onCancel(): void {
    this.displayDialog = false; // Cerrar el diálogo sin realizar acciones
    this.selectedReserva = null; // Limpiar la selección de la reserva
  }
}
