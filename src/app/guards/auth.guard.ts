import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FunctionsService } from '../services/functions.service';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public auth: AuthService,
    public router: Router,
    public fun: FunctionsService,
    private message: MessageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    if (!this.auth.is_login) {
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const requiredRoles = route.data['roles'] as string[];
    const userRole = this.auth.getUserRole({ access_token: this.auth.getAccessToken() });

    if (userRole === 'AGENTE' && state.url === '/dashboard') {
      this.router.navigate(['/component/inicio']);
      return false;
    }

    if (!userRole || (requiredRoles && !requiredRoles.includes(userRole))) {
      this.message.add({ severity: 'error', summary: 'Error', detail: 'No tienes permisos para acceder a esta página' });
      this.router.navigateByUrl('/dashboard');
      return false;
    }

    return true;
  }
  
}
