import { EventEmitter, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  setVehicleId(id: any) {
    throw new Error('Method not implemented.');
  }
  user: any = {
    id: '',
    name: '',
    email: '',
    role: ''
  };
  
  is_login = false;
  isFirstLogin = false;

  results: any;

  isActive: boolean | null = null; // Variable para verificar si la cuenta del usuario está activa o no

  // Evento para abrir el modal de la clave de licencia
  openDialogEvent: EventEmitter<void> = new EventEmitter<void>();

  // Subject para verificar si la sesión del usuario ha expirado o no
  sessionExpiredSubject = new BehaviorSubject<boolean>(false);
  sessionExpired$: Observable<boolean> = this.sessionExpiredSubject.asObservable();

  constructor(
    private api: ApiService, 
    private router: Router
  ) {
    this.authenticate(); // Verifica si el usuario está autenticado o no
  }

  /**
   * Método para verificar si el usuario está autenticado o no.
   */
  authenticate() {
    if (this.getAccessToken() && this.getRefreshToken()) {
      this.is_login = true;
    }
  }

  /**
   * Método para manejar el primer inicio de sesión del usuario.
   */
  handleFirstLogin() {
    this.isFirstLogin = false;
  }

  /**
   * Método para decodificar el token de acceso.
   * @param token Token de acceso
   * @returns El token decodificado
   */
  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch(Error) {
      return null;
    }
  }

  /**
   * Método para obtener el token de acceso del almacenamiento local.
   * @returns El token de acceso
   */
  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  /**
   * Método para obtener el token de actualización del almacenamiento local.
   * @returns El token de actualización
   */
  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Método para obtener el rol del usuario del token de acceso decodificado.
   * @param data Token de acceso
   * @returns El rol del usuario
   */
  getUserRole(data: any) {
    const decodedAccessToken = this.getDecodedAccessToken(data.access_token);
    const userRole = decodedAccessToken.role;
    
    return userRole;
  }

  /**
   * Método para establecer el token de acceso y el token de actualización en el almacenamiento local.
   * @param data Datos del usuario autenticado
   */
  setLogin(data: any) {
    this.is_login = true;
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    this.setUser(data.user);
  }

  /**
   * Método para establecer los datos del usuario autenticado.
   * @param user Datos del usuario autenticado
   */
  setUser(user: any) {
    this.user = user;
  }

  /**
   * Método para cerrar la sesión del usuario.
   */
  logout() {
    localStorage.clear();
    this.is_login = false;
  }

  /**
   * Método para verificar si el usuario tiene el rol especificado.
   * @param roles Roles a verificar
   * @returns Un valor booleano que indica si el usuario tiene el rol especificado o no
   */
  hasRole(roles: string[]): boolean {
    return roles.includes(this.user.role);
  }
  
  getCurrentUser() {
    return this.user;
  }
}
