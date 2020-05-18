import React from 'react';

const Breadcrumbs = React.lazy(() => import('./views/Base/Breadcrumbs'));
const Cards = React.lazy(() => import('./views/Base/Cards'));
const Carousels = React.lazy(() => import('./views/Base/Carousels'));
const Collapses = React.lazy(() => import('./views/Base/Collapses'));
const Dropdowns = React.lazy(() => import('./views/Base/Dropdowns'));
const Forms = React.lazy(() => import('./views/Base/Forms'));
const Jumbotrons = React.lazy(() => import('./views/Base/Jumbotrons'));
const ListGroups = React.lazy(() => import('./views/Base/ListGroups'));
const Navbars = React.lazy(() => import('./views/Base/Navbars'));
const Navs = React.lazy(() => import('./views/Base/Navs'));
const Paginations = React.lazy(() => import('./views/Base/Paginations'));
const Popovers = React.lazy(() => import('./views/Base/Popovers'));
const ProgressBar = React.lazy(() => import('./views/Base/ProgressBar'));
const Switches = React.lazy(() => import('./views/Base/Switches'));
const Tables = React.lazy(() => import('./views/Base/Tables'));
const Tabs = React.lazy(() => import('./views/Base/Tabs'));
const Tooltips = React.lazy(() => import('./views/Base/Tooltips'));
const BrandButtons = React.lazy(() => import('./views/Buttons/BrandButtons'));
const ButtonDropdowns = React.lazy(() => import('./views/Buttons/ButtonDropdowns'));
const ButtonGroups = React.lazy(() => import('./views/Buttons/ButtonGroups'));
const Buttons = React.lazy(() => import('./views/Buttons/Buttons'));
const Charts = React.lazy(() => import('./views/Charts'));
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const CoreUIIcons = React.lazy(() => import('./views/Icons/CoreUIIcons'));
const Flags = React.lazy(() => import('./views/Icons/Flags'));
const FontAwesome = React.lazy(() => import('./views/Icons/FontAwesome'));
const SimpleLineIcons = React.lazy(() => import('./views/Icons/SimpleLineIcons'));
const Alerts = React.lazy(() => import('./views/Notifications/Alerts'));
const Badges = React.lazy(() => import('./views/Notifications/Badges'));
const Modals = React.lazy(() => import('./views/Notifications/Modals'));
const Colors = React.lazy(() => import('./views/Theme/Colors'));
const Typography = React.lazy(() => import('./views/Theme/Typography'));
const Widgets = React.lazy(() => import('./views/Widgets/Widgets'));
const Users = React.lazy(() => import('./views/Users/Users'));
const User = React.lazy(() => import('./views/Users/User'));

// Levector
const LevectorDashboard = React.lazy(() => import('./views/Dashboard/LevectorDashboard'));

// Custom Fields
const customFieldList = React.lazy(() => import('./views/CustomField/List'));
const customFieldCreate = React.lazy(() => import('./views/CustomField/Create'));
const customFieldEdit = React.lazy(() => import('./views/CustomField/Edit'));

// Person
const personList = React.lazy(() => import('./views/Persons/List'));
const personCreate = React.lazy(() => import('./views/Persons/Create'));
const personView = React.lazy(() => import('./views/Persons/View'));

// Prop
const propList = React.lazy(() => import('./views/Prop/List'));
const propCreate = React.lazy(() => import('./views/Prop/Create'));
const propView = React.lazy(() => import('./views/Prop/View'));

// Vestry
const vestryList = React.lazy(() => import('./views/Vestry/List'));
const vestryCreate = React.lazy(() => import('./views/Vestry/Create'));
const vestryView = React.lazy(() => import('./views/Vestry/View'));

// Location
const locationList = React.lazy(() => import('./views/Location/List'));
const locationCreate = React.lazy(() => import('./views/Location/Create'));
const locationView = React.lazy(() => import('./views/Location/View'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboardoriginal', name: 'Dashboard', component: Dashboard },
  { path: '/theme', exact: true, name: 'Theme', component: Colors },
  { path: '/theme/colors', name: 'Colors', component: Colors },
  { path: '/theme/typography', name: 'Typography', component: Typography },
  { path: '/base', exact: true, name: 'Base', component: Cards },
  { path: '/base/cards', name: 'Cards', component: Cards },
  { path: '/base/forms', name: 'Forms', component: Forms },
  { path: '/base/switches', name: 'Switches', component: Switches },
  { path: '/base/tables', name: 'Tables', component: Tables },
  { path: '/base/tabs', name: 'Tabs', component: Tabs },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  { path: '/base/carousels', name: 'Carousel', component: Carousels },
  { path: '/base/collapses', name: 'Collapse', component: Collapses },
  { path: '/base/dropdowns', name: 'Dropdowns', component: Dropdowns },
  { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  { path: '/base/navbars', name: 'Navbars', component: Navbars },
  { path: '/base/navs', name: 'Navs', component: Navs },
  { path: '/base/paginations', name: 'Paginations', component: Paginations },
  { path: '/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  { path: '/buttons', exact: true, name: 'Buttons', component: Buttons },
  { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  { path: '/buttons/button-dropdowns', name: 'Button Dropdowns', component: ButtonDropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', component: Flags },
  { path: '/icons/font-awesome', name: 'Font Awesome', component: FontAwesome },
  { path: '/icons/simple-line-icons', name: 'Simple Line Icons', component: SimpleLineIcons },
  { path: '/notifications', exact: true, name: 'Notifications', component: Alerts },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/widgets', name: 'Widgets', component: Widgets },
  { path: '/charts', name: 'Charts', component: Charts },
  { path: '/users', exact: true, name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },

  // Levector
  { path: '/dashboard', name: 'Dashboard', component: LevectorDashboard },

  // CustomField
  { path: '/customfield/:module/list', exact: true, name: 'Campo dinámico', component: customFieldList },
  { path: '/customfield/:module/create', exact: true, name: 'Campo dinámico', component: customFieldCreate },
  { path: '/customfield/:module/:customfieldId/edit', exact: true, name: 'Campo dinámico', component: customFieldEdit },

  // Person
  { path: '/person/list', exact: true, name: 'Personas', component: personList },
  { path: '/person/create', exact: true, name: 'Agregar Persona', component: personCreate },
  { path: '/person/edit/:id', exact: true, name: 'Editar Persona', component: personCreate },
  { path: '/person/:id', exact: true, name: 'Persona', component: personView },

  // Prop
  { path: '/prop/list', exact: true, name: 'Utilerías', component: propList },
  { path: '/prop/create', exact: true, name: 'Agregar Utilería', component: propCreate },
  { path: '/prop/edit/:id', exact: true, name: 'Editar Utilería', component: propCreate },
  { path: '/prop/:id', exact: true, name: 'Utilería', component: propView },

  // Vestry
  { path: '/vestry/list', exact: true, name: 'Vestuarios', component: vestryList} ,
  { path: '/vestry/create', exact: true, name: 'Agregar Vestuario', component: vestryCreate},
  { path: '/vestry/edit/:id', exact: true, name: 'Editar Vestuario', component: vestryCreate},
  { path: '/vestry/:id', exact: true, name: 'Vestuario', component: vestryView },

  // Locations
  { path: '/location/list', exact: true, name: 'Locaciones', component: locationList},
  { path: '/location/create', exact: true, name: 'Agregar Locación', component: locationCreate},
  { path: '/location/edit/:id', exact: true, name: 'Editar Locación', component: locationCreate},
  { path: '/location/:id', exact: true, name: 'Locación', component: locationView },

];

export default routes;
