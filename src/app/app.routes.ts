import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.RegisterComponent),
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then((m) => m.AdminComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/admin/dashboard/dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
      },
      {
        path: 'plants',
        loadComponent: () =>
          import('./pages/admin/plants/plants.component').then((m) => m.AdminPlantsComponent),
      },
      {
        path: 'care-tips',
        loadComponent: () =>
          import('./pages/admin/care-tips/care-tips.component').then((m) => m.AdminCareTipsComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/admin/users/users.component').then((m) => m.AdminUsersComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/admin/orders/orders').then((m) => m.OrdersComponent),
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./pages/admin/blog/admin-blog.component').then((m) => m.AdminBlogComponent),
      },
      {
        path: 'faq',
        loadComponent: () =>
          import('./pages/admin/faq/admin-faq.component').then((m) => m.AdminFaqComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/admin/settings/settings.component').then((m) => m.AdminSettingsComponent),
      },
    ],
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'care',
    loadComponent: () => import('./pages/care/care.component').then((m) => m.CareComponent),
  },
  {
    path: 'order',
    loadComponent: () => import('./pages/order/order').then((m) => m.OrderComponent),
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq.component').then((m) => m.FaqComponent),
  },
  {
    path: 'my-orders',
    loadComponent: () => import('./pages/my-orders/my-orders').then((m) => m.MyOrdersComponent),
  },
  {
    path: 'policy/:type',
    loadComponent: () => import('./pages/policy/policy.component').then((m) => m.PolicyComponent),
  }
];

