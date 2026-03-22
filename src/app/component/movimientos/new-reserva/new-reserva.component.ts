import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

// Declara el objeto google globalmente
declare var google: any;

@Component({
  selector: 'app-new-reserva',
  templateUrl: './new-reserva.component.html',
  styleUrls: ['./new-reserva.component.scss']
})
export class NewReservaComponent implements OnInit, AfterViewInit {
  @ViewChild('search', { static: false }) searchElementRef!: ElementRef;

  form: any;
  latitude: number = 27.4864;
  longitude: number = -109.9408;
  zoom: number = 12;
  loading: boolean | undefined;
  tipoIdLabel: string = 'No se ha seleccionado un tipo...';
  vehiculos: any[] = [];
  selectedCliente: any = null;
  selectedVehiculo: any = null;
  showVehiculoModal: boolean = false;
  totalRecords: number = 0;
  vehiculoFilter: string = '';
  vehiculoPage: number = 0;
  reservedDates: any[] = [];
  disabledDates: Date[] = [];
  minDate: Date = new Date();
  maxDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  directionsService = new google.maps.DirectionsService(); // Servicio de direcciones
  directionsRenderer = new google.maps.DirectionsRenderer(); // Renderizador de direcciones
  distance: string = ''; // Propiedad para almacenar la distancia recorrida
  isSaving = false;


  isNombreSearch: boolean = false;
  suggestions: any[] = [];

  constructor(
    private crud: CrudService,
    private formBuilder: UntypedFormBuilder,
    private fun: FunctionsService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      tipoId: ['', Validators.required],
      tipoTransaccion: ['', Validators.required],
      idValue: [{ value: '', disabled: true }, [Validators.required, this.validateIdValue.bind(this)]],
      nombreCliente: [{ value: '', disabled: true }, Validators.required],
      marca: [{ value: '', disabled: true }, Validators.required],
      modelo: [{ value: '', disabled: true }, Validators.required],
      tipoVehiculo: [{ value: '', disabled: true }, Validators.required],
      pagoDia: [{ value: '', disabled: false }, Validators.required],
      horaAdicional: [{ value: '', disabled: true }, Validators.required],
      salidaFecha: ['', Validators.required],
      salidaHora: ['', Validators.required],
      llegadaFecha: ['', Validators.required],
      llegadaHora: ['', Validators.required],
      dias: [{ value: '', disabled: true }],
      horas: [{ value: '', disabled: true }],
      totalPagar: [{ value: '', disabled: true }],
      deposito: [{ value: '', disabled: false }],
      formaPagoDeposito: ['', Validators.required],
      numeroDocDeposito: [''],
      formaPagoRenta: ['', Validators.required],
      numeroDocRenta: [''],
      destino: ['', Validators.required]
    });

    this.form.valueChanges.subscribe(() => this.calculateReserva());

    this.form.get('tipoId')?.valueChanges.subscribe((tipoId: string) => {
      if (tipoId) {
        if (tipoId === 'CURP') {
          this.tipoIdLabel = 'CURP';
        } else if (tipoId === 'CIC') {
          this.tipoIdLabel = 'CIC';
        } else if (tipoId === 'NOMBRE') {
          this.tipoIdLabel = 'Nombre';
          this.isNombreSearch = true; // Activa el autocompletado si es "Nombre"
          //console.log("Autocompletado activado para Nombre.");
        } else {
          this.isNombreSearch = false;
        }

        this.form.get('idValue')?.enable();
      } else {
        this.tipoIdLabel = 'No se ha seleccionado un tipo...';
        this.isNombreSearch = false; // Desactiva autocompletado si no se selecciona nada
        this.form.get('idValue')?.disable();
      }

      // Limpia el campo y sugerencias al cambiar tipo de identificación
      this.form.get('idValue')?.setValue('');
      this.suggestions = [];
      /* console.log("Tipo de identificación:", tipoId);
      console.log("Label actualizado a:", this.tipoIdLabel);
      console.log("isNombreSearch:", this.isNombreSearch); */
    });
  }

  ngAfterViewInit(): void {
    // Inicializa el mapa con DirectionsRenderer
    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: this.latitude, lng: this.longitude },
      zoom: this.zoom
    });
    this.directionsRenderer.setMap(map);

    // Configurar el autocompletador
    const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
      types: ['(cities)']
    });

    // Listener para el evento `place_changed`
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const destination = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };

        // Actualiza el formulario con el destino completo del autocompletador
        this.form.patchValue({ destino: place.formatted_address });
        this.calculateAndDisplayRoute(destination);
      } else {
        console.error('No se pudo obtener la ubicación');
      }
    });
  }

  calculateAndDisplayRoute(destination: { lat: number; lng: number }) {
    this.directionsService.route(
      {
        origin: { lat: 27.4864, lng: -109.9408 }, // Ciudad Obregón como punto de inicio
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING // Modo de viaje: conducción
      },
      (response: any, status: any) => {
        if (status === 'OK') {
          this.directionsRenderer.setDirections(response);

          // Obtener la distancia de la ruta
          const route = response.routes[0];
          const leg = route.legs[0]; // Primer tramo de la ruta
          this.distance = leg.distance.text; // Guardar la distancia en una propiedad
        }
      }
    );
  }

  // Resto de los métodos sigue igual...
  openVehiculoModal(): void {
    this.showVehiculoModal = true;
    this.loadVehiculos();
  }

  loadVehiculos(event?: LazyLoadEvent): void {
    const page = event ? event.first! / event.rows! : this.vehiculoPage;
    const search = this.vehiculoFilter;

    this.crud.getList(`vehiculos/paginados?page=${page}&size=10&search=${search}`).subscribe((response: any) => {
      this.vehiculos = response.data.map((vehiculo: any, index: number) => ({
        index: page * 10 + index + 1, // row index starts from 1 on each page
        id: vehiculo.id,
        placa: vehiculo.placa,
        marca: vehiculo.modelo.marca.nombre,
        modelo: vehiculo.modelo.nombre,
        ano: vehiculo.ano,
        color: vehiculo.color,
        tipo: vehiculo.tipo?.nombre,
        tarifa_diaria: vehiculo.tarifa_diaria,
        hora_adicional: vehiculo.hora_adicional,
        deposito: vehiculo.deposito
      }));

      this.totalRecords = response.totalItems;
      this.vehiculoPage = response.currentPage;
    });
  }

  onVehiculoSearchChange(event: any): void {
    this.vehiculoFilter = event.target.value;
    this.loadVehiculos();
  }

  selectVehiculo(vehiculo: any): void {
    this.selectedVehiculo = vehiculo;
    this.form.patchValue({
      placa: vehiculo.placa,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      tipoVehiculo: vehiculo.tipo,
      pagoDia: vehiculo.tarifa_diaria,
      horaAdicional: vehiculo.hora_adicional,
      deposito: vehiculo.deposito
    });
    this.loadReservedDates(vehiculo.id);
    this.closeVehiculoModal();
  }

  loadReservedDates(vehiculoId: string): void {
    this.crud.getList(`reservas/date/${vehiculoId}`).subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response)) {
          this.reservedDates = response.map((reserva: any) => ({
            fecha_salida: new Date(reserva.fecha_salida),
            fecha_llegada: new Date(reserva.fecha_llegada)
          }));
          this.generateDisabledDates();
        } else {
          this.reservedDates = [];
        }
      },
      error: (err) => {
        this.reservedDates = [];
      }
    });
  }

  generateDisabledDates(): void {
    const disabledDates: Date[] = [];
    this.reservedDates.forEach((range) => {
      let currentDate = new Date(range.fecha_salida);
      const endDate = new Date(range.fecha_llegada);

      // Itera desde la fecha de salida hasta la fecha de llegada
      while (currentDate <= endDate) {
        disabledDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1); // Avanza al siguiente día
      }
    });

    this.disabledDates = disabledDates; // Almacena las fechas deshabilitadas
  }

  validateDate(selectedDate: Date, type: string): void {
    const selected = selectedDate;

    // Verificar si la fecha seleccionada está en las fechas reservadas
    const isReserved = this.disabledDates.some(date =>
      date.toISOString().split('T')[0] === selected.toISOString().split('T')[0]
    );

    if (isReserved) {
      Swal.fire({
        title: 'Fecha no disponible',
        text: 'Esta fecha ya está reservada.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });

      // Resetea la fecha en el formulario
      if (type === 'salida') {
        this.form.patchValue({ salidaFecha: null });
      } else if (type === 'llegada') {
        this.form.patchValue({ llegadaFecha: null });
      }
    }
  }

  closeVehiculoModal(): void {
    this.showVehiculoModal = false;
  }

  validateIdValue(control: any) {
    const tipoId = this.form?.get('tipoId')?.value; // Acceso seguro al tipoId
    const value = control.value;

    if (tipoId === 'CURP' && !/^[A-Z0-9]{18}$/.test(value)) {
      return { invalidCurp: true };
    }

    if (tipoId === 'CIC' && (!/^\d+$/.test(value) || value.length !== 9)) {
      return { invalidCic: true };
    }

    if (tipoId === 'NOMBRE' && value.length < 2) {
      return { invalidNombre: true };
    }

    return null;
  }

  calculateReserva(): void {
    const salidaFecha = this.form.get('salidaFecha').value;
    const salidaHora = this.form.get('salidaHora').value;
    const llegadaFecha = this.form.get('llegadaFecha').value;
    const llegadaHora = this.form.get('llegadaHora').value;

    if (salidaFecha && salidaHora && llegadaFecha && llegadaHora) {
      const salida = moment(`${moment(salidaFecha).format('YYYY-MM-DD')} ${salidaHora}`, 'YYYY-MM-DD HH:mm');
      const llegada = moment(`${moment(llegadaFecha).format('YYYY-MM-DD')} ${llegadaHora}`, 'YYYY-MM-DD HH:mm');
      const diff = llegada.diff(salida);

      if (diff > 0) {
        const duration = moment.duration(diff);
        const days = Math.floor(duration.asDays()); // Obtiene los días completos
        const hours = duration.hours(); // Obtiene las horas restantes

        const pagoDia = this.form.get('pagoDia').value || 0;
        const horaAdicional = this.form.get('horaAdicional').value || 0;
        const totalPagar = (days * pagoDia) + (hours * horaAdicional);

        this.form.patchValue({
          dias: days,
          horas: hours,
          totalPagar: totalPagar.toFixed(2)
        }, { emitEvent: false }); // Evita disparar valueChanges
      } else {
        this.form.patchValue({
          dias: '',
          horas: '',
          totalPagar: ''
        }, { emitEvent: false });
      }
    }
  }

  calculateTotalRecibir(): string {
    const depositoControl = this.form.get('deposito');
    const totalPagarControl = this.form.get('totalPagar');

    if (!depositoControl || !totalPagarControl) {
      return '0.00';
    }

    const deposito = parseFloat(depositoControl.value) || 0;
    const renta = parseFloat(totalPagarControl.value) || 0;
    return (deposito + renta).toFixed(2);
  }

  buscarCliente(): void {
    if (this.form.get('idValue').valid) {
      this.loading = true;
      const idValue = this.form.get('idValue').value;

      this.crud.save('clientes/buscar-cliente', { idValue }).subscribe(
        (response: any) => {
          this.loading = false;
          this.selectedCliente = response;
          this.form.get('nombreCliente').setValue(`${response.nombre} ${response.paterno} ${response.materno}`);
        },
        (error) => {
          this.loading = false;
          this.form.get('nombreCliente').setValue('Cliente no encontrado');
        }
      );
    } else {
      this.form.get('idValue').markAsTouched();
    }
  }

  onSave(): void {
      // Evitar múltiples clics mientras se está procesando
  if (this.isSaving) {
    return;
  }

    if (this.form.dirty && this.form.valid) {
      // Verificar que el cliente esté seleccionado
      if (!this.selectedCliente) {
        Swal.fire({
          title: 'Error',
          text: 'Por favor, seleccione un cliente de las sugerencias antes de continuar.',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

      // Asume que el cliente está seleccionado y sigue con la lógica de creación
      this.loading = true;

      const clienteId = this.selectedCliente ? this.selectedCliente.id : null;
      const vehiculoId = this.selectedVehiculo ? this.selectedVehiculo.id : null;

      if (!vehiculoId) {
        this.loading = false;
        Swal.fire({
          title: 'Error',
          text: 'Por favor, seleccione un vehículo antes de continuar.',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

          // Iniciar el proceso de guardado
    this.isSaving = true;

    // Retrasar la reactivación del botón
    setTimeout(() => this.isSaving = false, 5000); // 5 segundos antes de permitir otro guardado

      const salidaFechaControl = this.form.get('salidaFecha');
      const salidaHoraControl = this.form.get('salidaHora');
      const llegadaFechaControl = this.form.get('llegadaFecha');
      const llegadaHoraControl = this.form.get('llegadaHora');

      if (!salidaFechaControl || !salidaHoraControl || !llegadaFechaControl || !llegadaHoraControl) {
        this.loading = false;
        this.fun.presentAlertError('Fechas o horas no están completas.');
        return;
      }

      const fechaSalida = moment(`${moment(salidaFechaControl.value).format('YYYY-MM-DD')} ${salidaHoraControl.value}`, 'YYYY-MM-DD HH:mm').toISOString();
      const fechaLlegada = moment(`${moment(llegadaFechaControl.value).format('YYYY-MM-DD')} ${llegadaHoraControl.value}`, 'YYYY-MM-DD HH:mm').toISOString();

      const formData = {
        tipo_transaccion: this.form.get('tipoTransaccion').value.toUpperCase(),
        cliente_id: clienteId,
        vehiculo_id: vehiculoId,
        fecha_salida: fechaSalida,
        fecha_llegada: fechaLlegada,
        deposito: this.form.get('deposito').value,
        formaPagoDeposito: this.form.get('formaPagoDeposito').value,
        numeroDocDeposito: this.form.get('numeroDocDeposito').value,
        totalRenta: this.form.get('totalPagar').value,
        formaPagoRenta: this.form.get('formaPagoRenta').value,
        numeroDocRenta: this.form.get('numeroDocRenta').value,
        agente_id: this.auth.user.id,
        destino: this.form.get('destino').value
      };

      this.crud.save('reservas', formData).subscribe({
        next: (response: any) => {
          this.isSaving = false; // Restablece el estado de guardado
          this.form.reset(); // Restablece el formulario
          Swal.fire({
        title: 'Éxito',
        text: 'Reserva creada correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
          }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigateByUrl("component/reservas/list");
        }
          });
        },
        error: (error) => {
          this.loading = false;
          this.isSaving = false; // Restablece el estado de guardado en caso de error

          let errorMessage = 'Error al guardar la reserva';
          
          // Check specific field validation errors
          if (error.error && error.error.errors) {
        const errors = error.error.errors;
        const fieldErrors = Object.keys(errors).map(key => `${key}: ${errors[key]}`);
        errorMessage = `Campos faltantes o inválidos:\n${fieldErrors.join('\n')}`;
          }

          Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Aceptar'
          });
        }
      });
    } else {
      for (let i in this.form.controls) {
        this.form.controls[i].markAsTouched();
      }
    }
  }

  // Método para cambiar el estado al seleccionar el tipo de identificación
  onTipoIdChange() {
    const tipoId = this.form.get('tipoId')?.value;
    this.isNombreSearch = tipoId === 'NOMBRE'; // Habilitar autocompletado solo si es "Nombre"
    this.form.get('idValue')?.setValue('');
    this.form.get('nombreCliente')?.setValue('');
    this.suggestions = [];
  }

  // Método para capturar la entrada de búsqueda
  onInputChange(event: any) {
    const value = event.target.value.trim();
    //console.log("Input value:", value); // Verifica el valor ingresado
    if (this.isNombreSearch && value.length >= 2) {
        //console.log("Fetching suggestions for:", value); // Verifica que se inicie la búsqueda
        this.crud.getList(`clientes/nombre-sugerencias?nombre=${value}`)
            .subscribe((data: any) => {
                //console.log("Suggestions received:", data); // Verifica los datos recibidos
                this.suggestions = data;
            }, (error) => {
                console.error("Error fetching suggestions:", error); // Error en la solicitud
            });
    } else {
        this.suggestions = [];
    }
  }

  // Método para seleccionar cliente de las sugerencias y limpiar el dropdown
  selectCliente(cliente: any) {
    this.selectedCliente = cliente;
    this.form.get('idValue')?.setValue(`${cliente.nombre} ${cliente.paterno.substring(0, 3)}... (Seleccionado)`);
    this.form.get('nombreCliente')?.setValue(`${cliente.nombre} ${cliente.paterno} ${cliente.materno}`);
    this.suggestions = []; // Limpiar las sugerencias después de seleccionar
  }

}
