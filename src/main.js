import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import { io } from 'socket.io-client'

import App from './App.vue'
import router from './router'

import ErrorMessage from './components/common/ErrorMessage.vue'

const app = createApp(App)



app.use(createPinia())
app.use(router)

const apiDomain = import.meta.env.VITE_API_DOMAIN
const wsConnection = import.meta.env.VITE_WS_CONNECTION

// Default Axios configuration
axios.defaults.baseURL = `http://${apiDomain}/api`
//axios.defaults.baseURL = 'http://web-dad-group-4-172.22.21.101.sslip.io/api'
app.provide('socket', io(wsConnection))
//app.provide('socket', io('http://web-dad-group-4-172.22.21.101.sslip.io'))

app.component('ErrorMessage', ErrorMessage)

app.mount('#app')
