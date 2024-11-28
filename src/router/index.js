import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import Login from '@/components/auth/Login.vue'

import Index from '@/components/game/Index.vue'
import Singleplayer from '@/components/game/Singleplayer.vue'
import Multiplayer from '@/components/game/Multiplayer.vue'

import ScoreBoard from '@/components/scoreBoard/ScoreBoard.vue'

import Dashboard from '@/components/adminTools/Dashboard.vue'
import Statistics from '@/components/adminTools/Statistics.vue'
import Users from '@/components/adminTools/Users.vue'

import AddBalance from '@/components/user/AddBalance.vue'
import MyAccount from '@/components/user/MyAccount.vue'
import GamesHistory from '@/components/user/GamesHistory.vue'
import TransactionHistory from '@/components/user/TransactionHistory.vue'

let handlingFirstRoute = true

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/singleplayer',
      name: 'singleplayer',
      component: Singleplayer
    },
    {
      path: '/multiplayer',
      name: 'multiplayer',
      component: Multiplayer
    },
    {
      path: '/addBalance',
      name: 'addBalance',
      component: AddBalance
    },
    {
      path: '/myAccount',
      name: 'myAccount',
      component: MyAccount
    },
    {
      path: '/scoreBoard',
      name: 'scoreBoard',
      component: ScoreBoard
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: Statistics
    },
    {
      path: '/users',
      name: 'users',
      component: Users
    },
    {
      path: '/gamesHistory',
      name: 'gamesHistory',
      component: GamesHistory
    },
    {
      path: '/transactionHistory',
      name: 'transactionHistory',
      component: TransactionHistory
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },
    /*{
      path: '/tasks',
      redirect: { name: 'tasks' }
    },
    {
      path: '/tasks/:id',
      name: 'updateTask',
      component: TaskUpdate,
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects
    },
    {
      path: '/projects/:id',
      name: 'updateProject',
      component: ProjectUpdate,
      props: route => ({ id: parseInt(route.params.id) })
    },    
    {
      path: '/projects/new',
      name: 'createProject',
      component: ProjectCreate,
    },*/    
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  

  const storeAuth = useAuthStore()
  if (handlingFirstRoute) {
    handlingFirstRoute = false
    await storeAuth.restoreToken()
  }

  //Routes not accessible to admins
  if ((storeAuth.userType == 'A') && ((to.name == 'index') || (to.name == 'singleplayer') || (to.name == 'multiplayer'))) {
    console.log(storeAuth.type)
    next({ name: 'dashboard' })
    return
  }

  //Routes not accessible to players
  if ((storeAuth.userType == 'P') && ((to.name == 'dashboard') || (to.name == 'statistics'))) {
    next({ name: 'index' })
    return
  }

  //Routes not accessible to anonumous users
  if ((!storeAuth.user) && ((to.name == 'dashboard') || (to.name == 'statistics'))) {
    next({ name: 'index' })
    return
  }

  // all other routes are accessible to everyone, including anonymous users
  next()
})

export default router
