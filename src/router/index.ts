import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@/views/LandingView.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView
    },
    {
      path: '/dashboard',
      name: 'load-dashboard',
      component: HomeView
    },
    {
      path: '/dashboard/:home?/room/:room?',
      name: 'dashboard',
      component: HomeView
    },
    {
      path: '/dashboard/:home?/routines',
      name: 'routines',
      component: HomeView
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
