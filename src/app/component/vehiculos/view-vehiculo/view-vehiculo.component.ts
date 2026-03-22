import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-view-vehiculo',
  templateUrl: './view-vehiculo.component.html',
  styleUrls: ['./view-vehiculo.component.scss'],
  providers: [MessageService]
})
export class ViewVehiculoComponent implements OnInit {
  items: MenuItem[] | any;
  activeItem: MenuItem | undefined;

  // Información del vehículo
  vehicle: any;
  kilometrajeHistorial: [] = [];

  // Gráfica
  basicData: any;
  basicOptions: any;

  // Archivos
  uploadedFiles: File[] = [];
  documents: any;

  // Datos de historial de kilometraje con paginación
  reservas: any[] = [];
  totalRecords: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  limit: number = 10;
response: any;
  recibido: any;

  constructor(
    private route: ActivatedRoute,
    private crud: CrudService,
    private config: PrimeNGConfig,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.items = [
      { label: 'Resumen' },
      { label: 'Documentos' },
      { label: 'Subir' }
    ];
    this.activeItem = this.items[0];

    const vehicleId = this.route.snapshot.paramMap.get('id');
    if (vehicleId) {
      this.getVehicleDetails(vehicleId);
      this.getKilometrajeHistorial(vehicleId, this.currentPage, this.limit);
    }

    // Configuración de la gráfica
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.basicData = {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Sales',
          data: [0, 0, 0, 0],
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgb(255, 159, 64)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)'
          ],
          borderWidth: 1
        }
      ]
    };

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  getVehicleDetails(id: string): void {
    this.crud.getList(`vehiculos/${id}`).subscribe(
      (response: any) => {
        this.vehicle = response;
      },
      (error) => {
        console.error('Error al obtener los detalles del vehículo:', error);
      }
    );
  }

  getKilometrajeHistorial(id: string, page: number, limit: number): void {
    this.crud.getList(`vehiculos/kms/${id}?page=${page}&limit=${limit}`).subscribe(
      (response: any) => {
        this.reservas = response.data;
        this.totalRecords = response.totalRecords;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
      },
      (error) => {
        console.error('Error al obtener el historial de kilometraje:', error);
      }
    );
  }

  changePage(page: number): void {
    const vehicleId = this.route.snapshot.paramMap.get('id');
    if (vehicleId) {
      this.getKilometrajeHistorial(vehicleId, page, this.limit);
    }
  }

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }

  toBack() {
    window.history.back();
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }
}
