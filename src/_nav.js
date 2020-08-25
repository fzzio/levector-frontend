import defines from '../src/defines'

export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard/0',
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
      module_id:1,
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
      module_id:2,
      children: [
        {
          name: 'Ver todos',
          url: '/prop/list',
        },
        {
          name: 'Agregar',
          url: '/prop/create',
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
      module_id:3,
      children: [
        {
          name: 'Ver todos',
          url: '/vestry/list',
        },
        {
          name: 'Agregar',
          url: '/vestry/create',
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
      module_id:4,
      children: [
        {
          name: 'Ver todos',
          url: '/location/list',
        },
        {
          name: 'Agregar',
          url: '/location/create',
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
