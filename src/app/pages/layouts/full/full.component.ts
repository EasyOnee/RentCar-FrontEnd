import { CommonModule } from "@angular/common";
import { Component, OnInit, HostListener } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";
import { NavigationComponent } from "src/app/shared/header/navigation.component";
import { SidebarComponent } from "src/app/shared/sidebar/sidebar.component";
import { RouteInfo } from "src/app/shared/sidebar/sidebar.metadata";

@Component({
  selector: "app-full-layout",
  standalone: true,
  imports: [RouterModule, SidebarComponent, NavigationComponent, CommonModule, NgbCollapseModule],
  templateUrl: "./full.component.html",
  styleUrls: ["./full.component.scss"],
})
export class FullComponent implements OnInit {
  public sidebarnavItems: RouteInfo[] = [];
  public isCollapsed = false;
  public innerWidth: number = 0;
  public defaultSidebar: string = "";
  public showMobileMenu = false;
  public expandLogo = false;
  public sidebartype = "full";
  showMenu: string = '';

  year = new Date().getFullYear();

  constructor(public router: Router) {}
  
  ngOnInit() {
    if (this.router.url === "/") {
      this.router.navigate(["/dashboard"]);
    }
    this.defaultSidebar = this.sidebartype;
    this.handleSidebar();
  }

  Logo() {
    this.expandLogo = !this.expandLogo;
  }

  @HostListener("window:resize", ["$event"])
  onResize() {
    this.handleSidebar();
  }

  handleSidebar() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1170) {
      this.sidebartype = "full";
    } else {
      this.sidebartype = this.defaultSidebar;
    }
  }

  toggleSidebarType() {
    switch (this.sidebartype) {
      case "full":
        this.sidebartype = "mini-sidebar";
        break;

      case "mini-sidebar":
        this.sidebartype = "full";
        break;

      default:
    }
  }

  toggleSubmenu(title: string) {
    if (this.showMenu === title) {
      this.showMenu = ''; // Cierra el submenú si ya está abierto
    } else {
      this.showMenu = title; // Abre el submenú
    }
  }

  onSidebarItemClick(event: MouseEvent, item: RouteInfo): void {
    if (item.submenu.length > 0) {
      event.preventDefault(); // Evita la navegación en caso de tener un submenu
      this.toggleSubmenu(item.title);
    } else {
      this.showMobileMenu = false;
    }
  }

  onSidebarClick(event: MouseEvent): void {
    // Obtiene el elemento que fue clicado
    const target = event.target as HTMLElement;
  
    // Verifica si el clic ocurrió en un elemento que tiene un submenu
    const hasSubmenu = target.closest('.sidebar-item')?.querySelector('.submenu') !== null;
    
    // Verifica si el clic ocurrió en un elemento que es parte de un dropdown
    const isDropdownItem = target.closest('.dropdown-item') !== null;
  
    // Si el clic no ocurrió en un elemento con submenu y no es parte de un dropdown, cierra el sidebar
    if (!hasSubmenu && !isDropdownItem) {
      this.showMobileMenu = false;
    }
  }
  
}
