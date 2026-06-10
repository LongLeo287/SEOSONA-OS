import { createRouter, createWebHistory } from 'vue-router'
import AssetsView from '../views/AssetsView.vue'
import SettingsView from '../views/SettingsView.vue'
import BrandView from '../views/BrandView.vue'

const routes = [
  {
    path: '/',
    name: 'assets',
    component: AssetsView
  },
  {
    path: '/assets',
    redirect: '/'
  },
  {
    path: '/brand',
    name: 'brand',
    component: BrandView
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
