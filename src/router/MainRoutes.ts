const MainRoutes = {
  path: '/',
  meta: {
    requiresAuth: false
  },
  redirect: '/dashboard',
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        meta: { requiresAuth: false, permission: '' },
        component: () => import('@/views/dashboards/default/Dashboard.vue')
      },
      {
        path: '/product-type',
        name: 'ProductType',
        meta: { requiresAuth: false, permission: '' },
        component: () => import('@/views/productType/productType.vue')
      },
      {
        path: '/product',
        name: 'Product',
        meta: { requiresAuth: false, permission: '' },
        component: () => import('@/views/product/product.vue')
      },
      {
        path: '/customer',
        name: 'customers',
        meta: { requiresAuth: false, permission: '' },
        component: () => import('@/views/customer/customer.vue')
      },
      {
        path: '/service',
        name: 'service',
        meta: { requiresAuth: false, permission: '' },
        component: () => import('@/views/service/service.vue')
      },
  ]
};

export default MainRoutes;
