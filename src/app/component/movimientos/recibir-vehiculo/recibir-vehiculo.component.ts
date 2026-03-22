import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CrudService } from 'src/app/services/crud.service';
import { Subscription } from 'rxjs';
import { FunctionsService } from 'src/app/services/functions.service';
import Swal from 'sweetalert2';
import { co } from '@fullcalendar/core/internal-common';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recibir-vehiculo',
  standalone: false,
  templateUrl: './recibir-vehiculo.component.html',
  styleUrls: ['./recibir-vehiculo.component.scss'],
})
export class RecibirVehiculoComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  form: any;

  displayDialog: boolean = false;
  reservas: any[] = [];
  selectedReserva: any;

  // Propiedades para la hora y minuto de salida
  salidaHora: number = 0;
  salidaMinuto: number = 0;
  salidaAMPM: string | undefined;

  // Propiedades para la hora y minuto de llegada
  llegadaHora: number = 0;
  llegadaMinuto: number = 0;
  llegadaAMPM: string = 'AM';
  fechaLlegadaCalculo: Date | null = null;

  nivelTanqueLlegada: string = '';  
  kilometrajeLlegada: number = 0; 
  currentUser: any;
  selectedReservaOriginal: any; 


  // Propiedades para la hora y minuto de llegada original
  llegadaHoraOriginal: number = 0;
  llegadaMinutoOriginal: number = 0;
  llegadaAMPMOriginal: string = 'AM';

  labelTotalAPagar: any;

  tolerancia: boolean = true; // Estado del checkbox

  constructor(
    private crud: CrudService,
    private fun: FunctionsService,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.currentUser = this.authService.getCurrentUser(); // Obtener usuario autenticado desde un servicio

  }

  ngOnInit(): void {
    this.getReservas();

    this.form = this.fb.group({
      combustible_recibido: ['', Validators.required],
      kmsllegada: ['', Validators.required],
      llegadaFecha2: [''],
      llegadaHora2: [''],
      llegadaMinuto2: [''],
      llegadaAMPM: ['']
    });
}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getReservas(): void {
    this.crud.getList('reservas/activa').subscribe({
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

  showDialog(Id: number): void {
    this.crud.getList(`recibir/${Id}`).subscribe({
        next: (response: any) => {
            this.selectedReserva = response;

            // Dividir fecha y hora de salida
            const fechaSalida = new Date(this.selectedReserva.reserva.fecha_salida);
            this.salidaHora = fechaSalida.getHours() % 12 || 12;
            this.salidaMinuto = fechaSalida.getMinutes();
            this.salidaAMPM = fechaSalida.getHours() >= 12 ? 'PM' : 'AM';

            // Dividir fecha y hora de llegada
            const fechaLlegada = new Date(this.selectedReserva.reserva.fecha_llegada);
            this.llegadaHoraOriginal = fechaLlegada.getHours() % 12 || 12;
            this.llegadaMinutoOriginal = fechaLlegada.getMinutes();
            this.llegadaAMPMOriginal = fechaLlegada.getHours() >= 12 ? 'PM' : 'AM';

            // Inicializar nueva hora de llegada con la misma hora que la llegada actual
            this.llegadaHora = this.llegadaHoraOriginal;
            this.llegadaMinuto = this.llegadaMinutoOriginal;
            this.llegadaAMPM = this.llegadaAMPMOriginal;

            this.displayDialog = true;
        },
        error: (error: any) => {
            console.error('Error al obtener la información de la reserva:', error);
        }
    });
  }

  setHoraMinutoLlegada(): void {
    const fechaLlegada = new Date(this.selectedReserva.reserva.fecha_llegada);

    // Llegada
    this.llegadaHora = fechaLlegada.getHours() % 12 || 12;
    this.llegadaMinuto = fechaLlegada.getMinutes();
    this.llegadaAMPM = fechaLlegada.getHours() >= 12 ? 'PM' : 'AM';
  }

  onLlegadaChange(): void {
    const nuevaFechaLlegada = (document.getElementById('llegadaFecha2') as HTMLInputElement).value;

    const nuevaFechaHora = new Date(nuevaFechaLlegada);
    
    // Ajustar la hora y minutos en la nueva fecha de llegada
    nuevaFechaHora.setHours(
      this.llegadaHora + (this.llegadaAMPM === 'PM' && this.llegadaHora !== 12 ? 12 : 0)
    );
    nuevaFechaHora.setMinutes(this.llegadaMinuto);

    // Obtener la fecha de llegada actual como objeto Date
    const fechaLlegadaActual = new Date(this.selectedReserva.reserva.fecha_llegada);
    
    // Restar un día a la fecha de llegada actual para la comparación
    fechaLlegadaActual.setDate(fechaLlegadaActual.getDate() - 1);

    // Si la nueva fecha de llegada es antes de la actual, no permitimos el cambio
    if (nuevaFechaHora <= fechaLlegadaActual) {
      this.selectedReserva.reserva.total = 0;
      this.selectedReserva.reserva.dias = 0;
      this.selectedReserva.reserva.horas = 0;
      return;
    }
    
    // Calcula la diferencia y actualiza los campos de días, horas y total
    this.calculateTotal(nuevaFechaHora);
  }
  
  calculateTotal(nuevaFechaHora: Date): void {
    const fechaLlegadaActual = new Date(this.selectedReserva.reserva.fecha_llegada);
    
    // Restar un día a la fecha de llegada actual para la comparación de días
    fechaLlegadaActual.setDate(fechaLlegadaActual.getDate() - 1);
    fechaLlegadaActual.setHours(0, 0, 0, 0); // Ajustar al inicio del día para comparación

    // Ajustar la nueva fecha de llegada al inicio del día para comparación
    const nuevaFechaInicio = new Date(nuevaFechaHora);
    nuevaFechaInicio.setHours(0, 0, 0, 0);

    // Calcular la diferencia en milisegundos
    const diffTime = nuevaFechaInicio.getTime() - fechaLlegadaActual.getTime();

    // Calcular la diferencia en días completos
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Días completos
  
    // Calcular la diferencia en horas cuando las fechas son iguales pero las horas son diferentes
    let extraHours = 0;
    if (diffDays === 0) {
      // Usar fechas originales para calcular las horas exactas de diferencia
      const diffHoursTime = nuevaFechaHora.getTime() - new Date(this.selectedReserva.reserva.fecha_llegada).getTime();
      extraHours = Math.floor(diffHoursTime / (1000 * 60 * 60)); // Diferencia de horas
  
      // Aplicar tolerancia de 1 hora
      if (extraHours <= 1 && extraHours >= 0) {
        extraHours = 0; // Si la diferencia es de 1 hora o menos, no contar diferencia
      } else if (extraHours < 0) {
        extraHours += 24; // Si la diferencia es negativa, sumamos 24 horas
      }
    } else {
      // Si hay diferencia de días, calcular horas restantes
      const diffHoursTime = nuevaFechaHora.getTime() - new Date(this.selectedReserva.reserva.fecha_llegada).getTime();
      extraHours = Math.floor((diffHoursTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Horas adicionales
    }
    
    // Calcular el total a pagar
    let diferenciaTotal = (diffDays * this.selectedReserva.vehiculo.tarifa_diaria) +
                            (extraHours * this.selectedReserva.vehiculo.hora_adicional);
    
    // Si el checkbox de tolerancia está activado, restar el monto de una hora adicional
    if (this.tolerancia && extraHours > 0) {
      diferenciaTotal -= this.selectedReserva.vehiculo.hora_adicional; // Restar el valor de una hora adicional
    }

    // Actualizar los valores en la reserva
    this.selectedReserva.reserva.dias = diffDays;
    this.selectedReserva.reserva.horas = extraHours;
    this.selectedReserva.reserva.total = diferenciaTotal;

    this.fechaLlegadaCalculo = nuevaFechaHora; // Siempre actualizar la fecha calculada
  }

  // Método para actualizar cuando cambia el estado del checkbox
  onToleranciaChange(): void {
    if (this.fechaLlegadaCalculo) {
      this.calculateTotal(this.fechaLlegadaCalculo); // Recalcular el total con la tolerancia aplicada
    }
  }

  onSave(): void {
    const data = {
      folio: this.selectedReserva.reserva.folio,
      nuevaFechaLlegada: this.fechaLlegadaCalculo,
      diferenciaAPagar: this.selectedReserva.reserva.total
    };

    this.crud.save('recibir/vehiculo', data).subscribe({
      next: (response: any) => {
        this.displayDialog = false;

        Swal.fire({
          title: 'Vehículo recibido',
          text: 'El vehículo ha sido recibido con éxito',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          this.displayDialog = false
          this.getReservas();
        });
      },
      error: (error: any) => {
        console.error('Error al recibir el vehículo:', error);
      },
    });
    const data2 = {
      folioReserva: this.selectedReserva.reserva.folio,
      id_vehiculo: this.selectedReserva.vehiculo.id,
      kilometraje_recibido: this.form.get('kmsllegada').value,
      combustible_recibido: this.form.get('combustible_recibido').value,
      observaciones: this.selectedReserva.vehiculo.observaciones, 
      receivedBy: this.currentUser.id
    };

    this.crud.save('bitacoraRecibir/createBitacora', data2).subscribe({
      next: (response: any) => {
        this.displayDialog = false;
        this.getReservas();
        this.form.reset(); 
        this.nivelTanqueLlegada = '';
        this.kilometrajeLlegada = 0;  
      },
      error: (error: any) => {
        console.error('Error al recibir el vehículo:', error);
      },
    });
  }

  onCancel(): void {
    this.displayDialog = false; 
    this.form.reset(); 
    this.nivelTanqueLlegada = '';
    this.kilometrajeLlegada = 0;  
}

}
