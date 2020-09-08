import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/Index.vue'),
    children: [
      {
        path: '/',
        name: 'casino-config',
        component: () => import('@/views/CasinoConfig.vue'),
      },
      {
        path: '/casino-revenue',
        name: 'casino-revenue',
        component: () => import('@/views/CasinoRevenue.vue'),
      },
    ],
  },
]

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
