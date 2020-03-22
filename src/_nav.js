import defines from '../src/defines'

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
              url: '/customfield/' + defines.LVT_CASTING + '/create',
            },
            {
              name: 'Ver todas',
              url: '/customfield/' + defines.LVT_CASTING + '/list',
            },
          ],
        },
      ],
    },
    {
      name: 'Utilería',
      icon: 'icon-umbrella',
      children: [
        {
          name: 'Ver todos',
          url: '/props/list',
        },
        {
          name: 'Agregar',
          url: '/props/create',
        },
        {
          name: 'Campos',
          children: [
            {
              name: 'Agregar',
              url: '/customfield/' + defines.LVT_PROPS + '/create',
            },
            {
              name: 'Ver todas',
              url: '/customfield/' + defines.LVT_PROPS + '/list',
            },
          ],
        },
      ],
    },
    {
      name: 'Vestuario',
      icon: 'icon-mustache',
      children: [
        {
          name: 'Ver todos',
          url: '/props/list',
        },
        {
          name: 'Agregar',
          url: '/props/create',
        },
        {
          name: 'Campos',
          children: [
            {
              name: 'Agregar',
              url: '/customfield/' + defines.LVT_VESTRY + '/create',
            },
            {
              name: 'Ver todas',
              url: '/customfield/' + defines.LVT_VESTRY + '/list',
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
              url: '/customfield/' + defines.LVT_LOCATIONS + '/create',
            },
            {
              name: 'Ver todas',
              url: '/customfield/' + defines.LVT_LOCATIONS + '/list',
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
