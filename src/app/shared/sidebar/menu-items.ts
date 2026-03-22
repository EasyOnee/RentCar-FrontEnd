import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    path: '/dashboard',
    title: 'Panel de control',
    icon: 'bi bi-speedometer2',
    role: ['SUPERADMIN', 'ADMIN'],
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/users',
    title: 'Usuarios',
    icon: 'bi bi-person',
    role: ['SUPERADMIN'],
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '',
    title: 'Gestión Flota',
    icon: 'bi bi-collection',
    role: ['SUPERADMIN', 'ADMIN'],
    class: '',
    extralink: false,
    submenu: [
      {
        path: '/component/vehiculos/marcas/list',
        title: 'Marcas',
        icon: '',
        role: ['SUPERADMIN', 'ADMIN'],
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/vehiculos/modelos/list',
        title: 'Modelos',
        icon: '',
        role: ['SUPERADMIN', 'ADMIN'],
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/vehiculos/tipos/list',
        title: 'Tipos de vehículo',
        icon: '',
        role: ['SUPERADMIN', 'ADMIN'],
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/vehiculos/list',
        title: 'Vehículos',
        icon: '',
        role: ['SUPERADMIN', 'ADMIN'],
        class: '',
        extralink: false,
        submenu: []
      },
      /* {
        path: '/component/vehiculos/combustibles/list',
        title: 'Combustibles',
        icon: '',
        role: ['SUPERADMIN', 'ADMIN'],
        class: '',
        extralink: false,
        submenu: []
      }, */
      /* {
        path: '/component/vehiculos/combustibles/suplidores/list',
        title: 'Suplidores',
        icon: '',
        role: ['SUPERADMIN', 'ADMIN'],
        class: '',
        extralink: false,
        submenu: []
      } */
    ]
  },
  {
    path: '/component/clientes/list',
    title: 'Clientes',
    icon: 'bi bi-people',
    role: ['SUPERADMIN', 'ADMIN'],
    class: '',
    extralink: false,
    submenu: []
  },
  
  //
  {
    path: '/component/reservas/list',
    title: 'Liberar vehículos',
    icon: 'bi bi-arrow-up-right',
    role: ['AGENTE'],
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/reservas/recibir',
    title: 'Recibir vehículos',
    icon: 'bi bi-arrow-down-left',
    role: ['AGENTE'],
    class: '',
    extralink: false,
    submenu: []
  },
  //

  {
    path: '',
    title: 'Movimientos',
    icon: 'bi bi-arrow-repeat',
    role: ['SUPERADMIN', 'ADMIN'],
    class: '',
    extralink: false,
    submenu: [
      {
        path: '/component/reservas/new',
        title: 'Renta o Reserva',
        icon: '',
        role: ['SUPERADMIN', 'ADMIN'],
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/reservas/recibir',
        title: 'Recibir vehículo',
        icon: '',
        role: ['SUPERADMIN', 'ADMIN'],
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/reservas/list',
        title: 'Lista de reservas',
        icon: '',
        role: ['SUPERADMIN', 'ADMIN'],
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/reservas/anular',
        title: 'Anular reserva',
        icon: '',
        role: ['SUPERADMIN', 'ADMIN'],
        class: '',
        extralink: false,
        submenu: []
      }
    ]
  },
  /* {
    path: '',
    title: 'Facturación',
    icon: 'bi bi-cash-coin',
    role: ['SUPERADMIN'],
    class: '',
    extralink: false,
    submenu: []
  }, */
  {
    path: 'component/reportes',
    title: 'Reportes',
    icon: 'bi bi-file-earmark-bar-graph',
    role: ['SUPERADMIN', 'ADMIN'],
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '',
    title: 'Configuración',
    icon: 'bi bi-gear',
    role: ['SUPERADMIN'],
    class: '',
    extralink: false,
    submenu: []
  }
];
