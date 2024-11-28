import { createRouter, createWebHistory } from 'vue-router'
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

export default router
