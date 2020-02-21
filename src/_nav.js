export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
    },
    {
      divider: true,
    },
    {
      title: true,
      name: 'Levector',
    },
    {
      name: 'Casting',
      url: '',
      icon: 'icon-people',
      children: [
        {
          name: 'Ver todos',
          url: '/person/list',
        },
        {
          name: 'Agregar',
          url: '/person/create',
        },
        {
          name: 'Campos',
          children: [
            {
              name: 'Agregar',
              url: '/customfield/create',
            },
            {
              name: 'Ver todas',
              url: '/customfield/list',
            },
          ],
        },
      ],
    },
    {
      name: 'Locaciones',
      icon: 'icon-location-pin',
      children: [
        {
          name: 'Ver todos',
          url: '',
        },
        {
          name: 'Agregar',
          url: '',
        },
        {
          name: 'Campos',
          children: [
            {
              name: 'Agregar',
              url: '',
            },
            {
              name: 'Ver todas',
              url: '',
            },
          ],
        },
      ],
    },
    {
      name: 'Utilería y vestuario',
      icon: 'icon-mustache',
      children: [
        {
          name: 'Ver todos',
          url: '',
        },
        {
          name: 'Agregar',
          url: '',
        },
        {
          name: 'Campos',
          children: [
            {
              name: 'Agregar',
              url: '',
            },
            {
              name: 'Ver todas',
              url: '',
            },
          ],
        },
      ],
    },
    {
      divider: true,
    },
    {
      title: true,
      name: 'Configuraciones',
      url: '',
      icon: '',
    },
  ],
};
