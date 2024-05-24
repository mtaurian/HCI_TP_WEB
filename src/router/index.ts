import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@/views/LandingView.vue'
import HomeView from '@/views/HomeView.vue'
import RoutinesView from '@/views/RoutinesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView
    },
    {
      path: '/dashboard/routines',
      name: 'routines',
      component: RoutinesView
    },
    {
      path: '/dashboard/routines/:home',
      name: 'routines',
      component: RoutinesView
    },
    {
      path: '/dashboard/:home?',
      name: 'load-dashboard',
      component: HomeView
    },
    {
      path: '/dashboard/:home?/room/:room?',
      name: 'dashboard',
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
