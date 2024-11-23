import { createRouter, createWebHistory } from 'vue-router'
//import Tasks from '@/components/tasks/Tasks.vue'
//import TaskUpdate from '@/components/tasks/TaskUpdate.vue'
//import ProjectUpdate from '@/components/projects/ProjectUpdate.vue'
//import ProjectCreate from '@/components/projects/ProjectCreate.vue'
//import Projects from '@/components/projects/Projects.vue'
import Login from '@/components/auth/Login.vue'
import Singleplayer from '@/components/singleplayer/Singleplayer.vue'
import Multiplayer from '@/components/multiplayer/Multiplayer.vue'
import Balance from '@/components/balance/Balance.vue'
import ScoreBoard from '@/components/scoreBoard/ScoreBoard.vue'
import Statistics from '@/components/statistics/Statistics.vue'
import Users from '@/components/users/Users.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'singleplayer',
      component: Singleplayer
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/multiplayer',
      name: 'multiplayer',
      component: Multiplayer
    },
    {
      path: '/balance',
      name: 'balance',
      component: Balance
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
