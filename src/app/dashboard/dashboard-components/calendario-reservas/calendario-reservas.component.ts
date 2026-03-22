import { Component, OnInit, HostListener, AfterViewInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CrudService } from 'src/app/services/crud.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calendario-reservas',
  templateUrl: './calendario-reservas.component.html',
  styleUrls: ['./calendario-reservas.component.css']
})
export class CalendarioReservasComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    locale: 'es',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    editable: false,
    selectable: true,
    dayMaxEvents: true,
    eventClick: this.handleEventClick.bind(this),
    height: 'auto',
    expandRows: true,
    contentHeight: 'auto',
    aspectRatio: 1.35,
    displayEventTime: false, // Oculta las horas de los eventos
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      list: 'Lista'
    }
  };

  constructor(private crud: CrudService) {}

  ngOnInit() {
    this.loadActiveReservations();
  }

  ngAfterViewInit() {
    this.updateViewOnResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateViewOnResize(); 
  }

  updateViewOnResize() {
    const width = window.innerWidth;
    if (width <= 768) {
      this.calendarOptions.initialView = 'timeGridDay'; 
      this.calendarOptions.headerToolbar = {
        left: 'prev,next', 
        center: 'title',
        right: '' 
      };
    } else {
      this.calendarOptions.initialView = 'dayGridMonth';
      this.calendarOptions.headerToolbar = {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay' 
      };
    }

    this.updateCalendarOptions(); // Actualiza las opciones del calendario
  }

  updateCalendarOptions() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.setOption('headerToolbar', this.calendarOptions.headerToolbar);
    calendarApi.setOption('initialView', this.calendarOptions.initialView);
  }

  loadActiveReservations(): void {
    this.crud.getList('reservas/calendario').subscribe({
      next: (reservas: any) => {
        this.calendarOptions.events = reservas.map((reserva: any) => {
          // Define el color según el estado: rojo para 'PENDIENTE', verde para 'EN CURSO'
          const color = reserva.estado === 'PENDIENTE' ? '#f4d44d' : '#099926'; // Define el color según el estado
          return {
            title: `${reserva.placa} - ${reserva.marca} ${reserva.modelo} ${reserva.ano}`,
            start: reserva.fecha_salida,
            end: reserva.fecha_llegada,
            display: 'block',
            backgroundColor: color,
            borderColor: color,
            textColor: '#ffffff',
            extendedProps: {
              estado: reserva.estado, 
              cliente: reserva.cliente 
            }
          };
        });
  
        // Actualiza las opciones del calendario para reflejar los cambios
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.refetchEvents(); // Refresca los eventos para aplicar los nuevos colores
      },
      error: (error) => {
        console.error('Error al cargar las reservas activas:', error);
      }
    });
  }
  
  handleEventClick(info: any) {
    const cliente = info.event.extendedProps.cliente; // Obtén el nombre del cliente desde los props extendidos
    const estado = info.event.extendedProps.estado; // Obtén el estado desde los props extendidos
  
    Swal.fire({
      title: 'Reserva Seleccionada',
      html: `
      <strong>Cliente:</strong> ${cliente}<br>
      <strong>Auto:</strong> ${info.event.title.split(' - ')[1]}<br>
      <strong>Número de Placa:</strong> ${info.event.title.split(' - ')[0]}<br>
      <strong>Fecha de Salida:</strong> ${info.event.start.toLocaleDateString()}<br>
      <strong>Fecha de Llegada:</strong> ${info.event.end ? new Date(info.event.end).toLocaleDateString() : 'No disponible'}<br>
      `,
      icon: 'info',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cerrar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    });
  }
  
}
