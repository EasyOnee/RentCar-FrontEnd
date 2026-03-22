import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudService } from 'src/app/services/crud.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { TooltipModel } from 'chart.js';


Chart.register(ChartDataLabels);

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent implements OnInit {
  formReporte!: FormGroup;

  // Variables para fechas de reporte originales
  startDate: string = '';
  endDate: string = '';

  // Variables para fechas de reporte con un día adicional
  displayStartDate: string = '';
  displayEndDate: string = '';

  // Variables de datos generales
  totalReservas: number = 0;
  totalEntregas: number = 0;
  totalCanceladas: number = 0;
  ingresosTotales: number = 0;

  // Datos para las gráficas
  dataVehiculos: any = {};
  dataClientesStacked: any = {};
  chartOptions: any = {};
  stackedOptions: any = {};

  // Variables para almacenar los datos del backend
  reservas: any[] = [];
  clientesData: any[] = [];
  vehiculosData: any[] = [];

  reporte: boolean = true;

  // Variables para la barra de progreso
  progressVisible: boolean = false;
  progressValue: number = 0;
  dialogVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private crud: CrudService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.initForm();
  }

  // Inicializar el formulario
  initForm() {
    this.formReporte = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
    });
  }

  // Método para enviar las fechas y obtener las reservas filtradas
  filtrarReservasPorFecha() {
    if (this.formReporte.valid) {
      const { startDate, endDate } = this.formReporte.value;

      // Formatear las fechas originales en DD/MM/YYYY
      this.startDate = new Date(startDate).toLocaleDateString('es-ES');
      this.endDate = new Date(endDate).toLocaleDateString('es-ES');

      // Asignar las fechas a las variables de visualización y sumar un día
      const displayStart = new Date(startDate);
      const displayEnd = new Date(endDate);
      displayStart.setDate(displayStart.getDate() + 1);
      displayEnd.setDate(displayEnd.getDate() + 1);

      this.displayStartDate = displayStart.toLocaleDateString('es-ES');
      this.displayEndDate = displayEnd.toLocaleDateString('es-ES');

      const data = { startDate, endDate };

      // Mostrar el diálogo y la barra de progreso
      this.dialogVisible = true;
      this.progressVisible = true;
      this.progressValue = 0;
      this.renderer.addClass(document.body, 'blur-background');

      // Simular el progreso para que dure aproximadamente 10 segundos
      const interval = setInterval(() => {
        if (this.progressValue < 100) {
          this.progressValue += 10; // Incrementar en 10% cada vez
        } else {
          clearInterval(interval);
        }
      }, 1000);

      // Enviar las fechas al backend usando POST
      this.crud.save('reporte/filtrar', data).subscribe({
        next: (res: any) => {
          // Verificar si hay datos en la respuesta
          if (res.data.length > 0) {
            // Asignar los resultados recibidos a las variables
            this.reservas = res.data;
            this.totalReservas = res.totalReservas;
            this.totalEntregas = res.totalReservasFinalizadas;
            this.ingresosTotales = res.totalIngresos;
            this.totalCanceladas = res.totalReservasCancelada;
            this.clientesData = res.clientesData;
            this.vehiculosData = res.vehiculosData;

            // Actualizar el nombre del cliente en las reservas
            this.reservas = this.reservas.map((reserva: any) => {
              reserva.cliente = `${reserva.cliente.nombre} ${reserva.cliente.paterno} ${reserva.cliente.materno}`;
              return reserva;
            });

            this.reporte = false; // Mostrar la sección de reporte

            // Construir las gráficas con los datos obtenidos
            this.generarGraficaVehiculos();
            this.generarGraficaClientesStacked();
          } else {
            // Mostrar alerta si no hay datos
            Swal.fire({
              title: 'Sin datos',
              text: 'No se encontraron datos para el rango de fechas seleccionado.',
              icon: 'warning',
              confirmButtonText: 'Aceptar',
            });
            this.reporte = true; // Mantener el estado del reporte en true
          }

          // Finalizar el progreso y cerrar el diálogo después de 10 segundos
          setTimeout(() => {
            this.progressValue = 100;
            this.dialogVisible = false;
            this.renderer.removeClass(document.body, 'blur-background'); // Quitar desenfoque del fondo
          }, 10000); // 10 segundos
        },
        error: (err) => {
          clearInterval(interval);
          this.progressVisible = false;

          Swal.fire({
            title: 'Error',
            text: 'No se pudieron obtener las reservas filtradas. Intente de nuevo.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });

          // Cerrar el diálogo y quitar el desenfoque en caso de error
          this.dialogVisible = false;
          this.renderer.removeClass(document.body, 'blur-background');
        },
      });
    } else {
      this.formReporte.markAllAsTouched();
    }
  }

  // Método para limpiar los datos del reporte
  limpiarDatosReporte() {
    this.reservas = [];
    this.totalReservas = 0;
    this.totalEntregas = 0;
    this.totalCanceladas = 0;
    this.ingresosTotales = 0;
    this.reporte = true;
  }

// Método para descargar el reporte en formato PDF
descargarPDF() {
  const data = document.getElementById('reporte-content'); // Selecciona el contenedor

  if (data) {
    html2canvas(data, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Calcular el ancho y la altura de la imagen en el PDF
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Agregar la imagen al PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Obtener la fecha actual en formato DD-MM-YYYY
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses comienzan en 0
      const year = today.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      // Guardar el archivo con el nombre "report_DD-MM-YYYY.pdf"
      pdf.save(`report_${formattedDate}.pdf`);
    });
  }
}


// Método para generar la gráfica de Desempeño de Vehículos
generarGraficaVehiculos(): void {
  if (this.vehiculosData && this.vehiculosData.length > 0) {
    const topVehiculos = this.vehiculosData
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const labels = topVehiculos.map((veh) => veh.vehiculo);
    const data = topVehiculos.map((veh) => veh.count);

    this.dataVehiculos = {
      labels: labels,
      datasets: [
        {
          label: 'Reservas por Vehículo',
          data: data,
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF6384'],
          datalabels: {
            anchor: 'end',
            align: 'end',
            color: '#000',
            font: {
              weight: 'bold',
            },
          },
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          enabled: true,
          displayColors: false,
          callbacks: {
            label: (context: { label: string; raw: any }) => `${context.label}: ${context.raw}`,
          },
          external: (context: { tooltip: TooltipModel<"pie"> }) => {
            const tooltip = context.tooltip;
            if (tooltip.opacity === 0) {
              tooltip.opacity = 1;
            }
          },
        },
        datalabels: {
          display: true,
          color: '#000',
          font: {
            size: 23,
            weight: 'bold',
            backgroundColor: '#fff',

          },
          formatter: (value: number) => `${value}`,
        },
      },
    };
  }
}

generarGraficaClientesStacked() {
  if (this.clientesData && this.clientesData.length > 0) {
    const topClientes = this.clientesData
      .sort((a, b) => b.sumaFinalizadas - a.sumaFinalizadas)
      .slice(0, 5);

    // Extraer solo el primer nombre y el primer apellido
    const getFirstNameAndLastName = (fullName: string) => {
      const [firstName, lastName] = fullName.split(" ");
      return `${firstName} ${lastName || ""}`; // Incluye apellido si está disponible
    };

    const labels = topClientes.map((cliente) => getFirstNameAndLastName(cliente.nombre));
    const data = topClientes.map((cliente) => cliente.sumaFinalizadas);

    this.dataClientesStacked = {
      labels: labels,
      datasets: [
        {
          label: 'Ingresos por Cliente',
          data: data,
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF6384'],
        },
      ],
    };

    this.stackedOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          enabled: true,
          displayColors: false,
          callbacks: {
            label: (context: { label: string; raw: any }) => `${context.label}: ${context.raw}`,
          },
          external: (context: { tooltip: TooltipModel<"pie"> }) => {
            const tooltip = context.tooltip;
            if (tooltip.opacity === 0) {
              tooltip.opacity = 1;
            }
          },
        },
        datalabels: {
          display: true,
          formatter: (value: number) => `${value}`,
        },
      },
    };
  }
}


}
