import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  environment = environment;

  constructor(
    private http: HttpClient
  ) {}

  // Método para obtener solo el encabezado de autorización
  http_header() {
    return {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('access_token') as string,
        'Cache-Control': 'no-cache',
      }),
    };
  }

  get(data: string) {
    return this.http.get(environment.baseUrl + data, this.http_header());
  }

  post(data: string, body: any) {
    // Si body es una instancia de FormData, crea el encabezado con solo la autorización
    if (body instanceof FormData) {
      const headers = new HttpHeaders({
        Authorization: localStorage.getItem('access_token') as string,
      });
      return this.http.post(environment.baseUrl + data, body, { headers });
    } else {
      // Para otros tipos de datos, utiliza los encabezados completos
      return this.http.post(environment.baseUrl + data, body, this.http_header());
    }
  }

  put(data: string, body: any) {
    // Similar lógica al método post
    if (body instanceof FormData) {
      const headers = new HttpHeaders({
        Authorization: localStorage.getItem('access_token') as string,
      });
      return this.http.put(environment.baseUrl + data, body, { headers });
    } else {
      return this.http.put(environment.baseUrl + data, body, this.http_header());
    }
  }

  delete(data: string) {
    return this.http.delete(environment.baseUrl + data, this.http_header());
  }

  post_(data: string, body: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(environment.baseUrl + data, body, options);
  }

  post__(data: string, body: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(data, body, options);
  }

  get__(data: string) {
    return this.http.get(data);
  }

}
