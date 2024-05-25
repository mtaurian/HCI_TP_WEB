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
      path: '/pin/:pathMatch(.+)*',
      name: 'pin',
      component: () => import('../views/PinView.vue')
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
      path: '/dashboard/:home?/routines',
      name: 'routines',
      component: RoutinesView
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue')
    }
  ]
})

export default router
