export interface topcard {
    bgcolor: string;
    icon: string;
    title: string; 
    subtitle: string;
    href: string;
  }
  
  export const topcards: topcard[] = [
    {
      bgcolor: 'success',
      icon: 'bi bi-car-front',
      title: 'SIN DATO',  
      subtitle: 'Vehículo(s) registrado(s)',
      href: '/component/operators'
    },
    {
      bgcolor: 'primary',
      icon: 'bi bi-cash-coin',
      title: 'SIN DATO',
      subtitle: 'Monto total de reserva(s)',
      href: '/component/users'
    },
    {
      bgcolor: 'warning',
      icon: 'bi bi-people-fill',
      title: 'SIN DATO',
      subtitle: 'Cliente(s) registrado(s)',
      href: '/component/incubators'
    },
    {
      bgcolor: 'info',
      icon: 'bi bi-clipboard-data',
      title: 'SIN DATO',  
      subtitle: 'Reserva(s) activa(s)',
      href: '/component/monitoring'
    }
  ];
  