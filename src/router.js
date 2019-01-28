import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import { TokenService } from './service/storage.service'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        isPublic: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        isPublic: true,
        onlyWhenLoggedOut: true
      }
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      meta: {
        isPublic: false
      },
      component: () => import('./views/Leaderboard.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const { isPublic, onlyWhenLoggedOut } = to.meta
  const loggedIn = !!TokenService.getToken()

  if (!loggedIn && !isPublic) {
    return next('/login')
  }

  if (loggedIn && onlyWhenLoggedOut) {
    return next('/')
  }

  next()
})

export default router
