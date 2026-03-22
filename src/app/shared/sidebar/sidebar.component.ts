import { Component, OnInit } from '@angular/core';
import { ROUTES } from './menu-items';
import { RouteInfo } from './sidebar.metadata';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
//declare var $: any;

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public sidebarnavItems: RouteInfo[] = [];
  public showMobileMenu = false;

  showMenu = '';
  showSubMenu = '';

  constructor(
    private auth: AuthService
  ) {}

  ngOnInit() {
    //this.sidebarnavItems = ROUTES.filter((sidebarnavItem) => sidebarnavItem);
    this.sidebarnavItems = ROUTES.filter((item) => this.hasAccess(item)); // Filtra las rutas que el usuario tiene acceso
  }

  hasAccess(item: RouteInfo): boolean {
    if (!item.role || item.role.length === 0) {
      return true;
    }
    return this.auth.hasRole(item.role);
  }

  addExpandClass(element: string) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  toggleSubmenu(menuTitle: string): void {
    if (this.showMenu === menuTitle) {
      this.showMenu = '';
    } else {
      this.showMenu = menuTitle;
    }
  }

  isSubmenuActive(menuItem: RouteInfo): boolean {
    return this.showMenu === menuItem.title;
  }

  updateActiveMenu() {
    this.sidebarnavItems.forEach(item => {
      if (this.isSubmenuActive(item)) {
        this.showMenu = item.title;
      }
    });
  }

}
