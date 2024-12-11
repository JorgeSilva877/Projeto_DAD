import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import AboutUs from '@/components/app/AboutUs.vue'

import Login from '@/components/auth/Login.vue'
import Register from '@/components/auth/Register.vue'

import Index from '@/components/game/Index.vue'
import Singleplayer from '@/components/game/Singleplayer.vue'
import Multiplayer from '@/components/game/Multiplayer.vue'
import Singleplayer_Board from '@/components/game/Singleplayer_Board.vue'

import ScoreBoard from '@/components/scoreBoard/ScoreBoard.vue'

import Dashboard from '@/components/dashboard/Dashboard.vue'
import Statistics from '@/components/adminTools/Statistics.vue'
import Users from '@/components/adminTools/Users.vue'

import AddBalance from '@/components/user/AddBalance.vue'
import ViewProfile from '@/components/user/ViewProfile.vue'
import GamesHistory from '@/components/user/GamesHistory.vue'
import GameDetail from '@/components/user/GameDetail.vue'
import TransactionHistory from '@/components/user/TransactionHistory.vue'
import PersonalScoreboard from '@/components/user/PersonalScoreboard.vue'

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
      path: '/aboutUs',
      name: 'aboutUs',
      component: AboutUs
    },
    {
      path: '/index',
      redirect: { name: 'index' }
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
      path: '/viewProfile',
      name: 'viewProfile',
      component: ViewProfile
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
      component: GamesHistory,
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
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    { //estas rotas ainda dao para otimizar, coisa que futuramente farei
      path: '/singleplayer_3x4',
      name: 'singleplayer_3x4',
      component: Singleplayer_Board,
      props: {
        rows: 3,
        cols: 4,
      },
    },
    {
      path: '/singleplayer_4x4',
      name: 'singleplayer_4x4',
      component: Singleplayer_Board,
      props: {
        rows: 4,
        cols: 4,
      },
    },
    {
      path: '/singleplayer_6x6',
      name: 'singleplayer_6x6',
      component: Singleplayer_Board,
      props: {
        rows: 6,
        cols: 6,
      },
    },
    {
      path: '/games/:id',
      name: 'gameDetail',
      component: GameDetail,
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/gamesHistory/scoreboard/:id',
      name: 'personalScoreboard',
      component: PersonalScoreboard,
      props: route => ({ id: parseInt(route.params.id) })
    },
    /*{
      path: '/projects/:id',
      name: 'updateProject',
      component: ProjectUpdate,
      props: route => ({ id: parseInt(route.params.id) })
    },*/    
  ]
})

router.beforeEach(async (to, from, next) => {
  

  const storeAuth = useAuthStore()
  if (handlingFirstRoute) {
    handlingFirstRoute = false
    await storeAuth.restoreToken()
  }

  //Routes not accessible to admins
  if ((storeAuth.userType == 'A') && ((to.name == 'index') || (to.name == 'singleplayer') || (to.name == 'multiplayer') || (to.name == 'aboutUs') || (to.name == 'personalScoreboard'))) {
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
  if ((!storeAuth.user) && ((to.name == 'dashboard') || (to.name == 'viewProfile') || (to.name == 'gamesHistory') || (to.name == 'personalScoreboard') || (to.name == 'gameDetail'))) {
    next({ name: 'index' })
    return
  }

  //Routes not accessible to logged users
  if ((storeAuth.user) && ((to.name == 'register'))) {
    next({ name: from.name })
    return
  }

  // all other routes are accessible to everyone, including anonymous users
  next()
})

export default router
