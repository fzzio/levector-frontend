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
    /* 
    {
      title: true,
      name: 'Configuraciones',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Typography',
      url: '/theme/typography',
      icon: 'icon-pencil',
    },
    {
      title: true,
      name: 'Components',
      wrapper: {
        element: '',
        attributes: {},
      },
    },
    {
      name: 'Charts',
      url: '/charts',
      icon: 'icon-pie-chart',
    },
    {
      name: 'Icons',
      url: '/icons',
      icon: 'icon-star',
      children: [
        {
          name: 'CoreUI Icons',
          url: '/icons/coreui-icons',
          icon: 'icon-star',
          badge: {
            variant: 'info',
            text: 'NEW',
          },
        },
        {
          name: 'Flags',
          url: '/icons/flags',
          icon: 'icon-star',
        },
        {
          name: 'Font Awesome',
          url: '/icons/font-awesome',
          icon: 'icon-star',
          badge: {
            variant: 'secondary',
            text: '4.7',
          },
        },
        {
          name: 'Simple Line Icons',
          url: '/icons/simple-line-icons',
          icon: 'icon-star',
        },
      ],
    },
    {
      name: 'Notifications',
      url: '/notifications',
      icon: 'icon-bell',
      children: [
        {
          name: 'Alerts',
          url: '/notifications/alerts',
          icon: 'icon-bell',
        },
        {
          name: 'Badges',
          url: '/notifications/badges',
          icon: 'icon-bell',
        },
        {
          name: 'Modals',
          url: '/notifications/modals',
          icon: 'icon-bell',
        },
      ],
    },
    {
      name: 'Widgets',
      url: '/widgets',
      icon: 'icon-calculator',
      badge: {
        variant: 'info',
        text: 'NEW',
      },
    },
    {
      divider: true,
    },
    {
      title: true,
      name: 'Extras',
    },
    {
      name: 'Pages',
      url: '/pages',
      icon: 'icon-star',
      children: [
        {
          name: 'Login',
          url: '/login',
          icon: 'icon-star',
        },
        {
          name: 'Register',
          url: '/register',
          icon: 'icon-star',
        },
        {
          name: 'Error 404',
          url: '/404',
          icon: 'icon-star',
        },
        {
          name: 'Error 500',
          url: '/500',
          icon: 'icon-star',
        },
      ],
    },
    {
      name: 'Disabled',
      url: '/dashboard',
      icon: 'icon-ban',
      attributes: { disabled: true },
    },
    {
      name: 'Download CoreUI',
      url: 'https://coreui.io/react/',
      icon: 'icon-cloud-download',
      class: 'mt-auto',
      variant: 'success',
      attributes: { target: '_blank', rel: "noopener" },
    },
    {
      name: 'Try CoreUI PRO',
      url: 'https://coreui.io/pro/react/',
      icon: 'icon-layers',
      variant: 'danger',
      attributes: { target: '_blank', rel: "noopener" },
    }, 
    */
  ],
};
