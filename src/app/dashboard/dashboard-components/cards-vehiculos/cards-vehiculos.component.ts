import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cards-vehiculos',
  templateUrl: './cards-vehiculos.component.html',
  styleUrls: ['./cards-vehiculos.component.css']
})
export class CardsVehiculosComponent implements OnInit {

  dataCostosCombustible: any;
  dataCostosMantenimiento: any;
  dataCostoPorKM: any;

  basicOptions: any;

  ngOnInit() {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      this.dataCostosCombustible = {
          labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
          datasets: [
              {
                  label: 'Costos Combustible',
                  data: [65, 59, 80, 81, 56, 55, 40],
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1
              }
          ]
      };

      this.dataCostosMantenimiento = {
          labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
          datasets: [
              {
                  label: 'Costos Mantenimiento',
                  data: [45, 49, 60, 71, 46, 35, 30],
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1
              }
          ]
      };

      this.dataCostoPorKM = {
          labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
          datasets: [
              {
                  label: 'Costo por KM',
                  data: [85, 69, 90, 101, 76, 65, 60],
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
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
}
