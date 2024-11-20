<script setup>
import { onMounted, useTemplateRef, provide } from 'vue'
import { RouterView } from 'vue-router'
import Toaster from '@/components/ui/toast/Toaster.vue'
import GlobalAlertDialog from '@/components/common/GlobalAlertDialog.vue'
import { useAuthStore } from '@/stores/auth'

//const storeProject = useProjectStore()
//const storeTask = useTaskStore()
const storeAuth = useAuthStore()

/*onMounted(() => {
  storeTask.fetchTasks()
  storeProject.fetchProjects()
})*/


const alertDialog = useTemplateRef('alert-dialog')
provide('alertDialog', alertDialog)

const logoutConfirmed = () => {
  storeAuth.logout()
}

const logout = () => {
  alertDialog.value.open(logoutConfirmed,
    'Logout confirmation?', 'Cancel', `Yes, I want to log out`,
    `Are you sure you want to log out? You can still access your account later with
    your credentials.`)
}
</script>

<template>
  <Toaster />
  <GlobalAlertDialog ref="alert-dialog"></GlobalAlertDialog>
  <div class="p-8 mx-auto max-w-3xl">
    <h1 class="text-5xl pb-8">MemoryGame</h1>
    <nav class="flex space-x-1 border-b-2 border-gray-800 text-base">
      <RouterLink :to="{ name: 'singleplayer'}" class="w-24 h-10 leading-10 text-center rounded-t-xl
          border-none  text-white select-none bg-gray-400 cursor-pointer hover:bg-gray-500"
          activeClass="bg-gray-800 hover:bg-gray-800">
                  Singleplayer
      </RouterLink>
      <RouterLink v-show="storeAuth.user" :to="{ name: 'multiplayer'}" class="w-24 h-10 leading-10 text-center rounded-t-xl
          border-none  text-white select-none bg-gray-400 cursor-pointer hover:bg-gray-500"
          activeClass="bg-gray-800 hover:bg-gray-800">
                  Multiplayer
      </RouterLink>
      <RouterLink v-show="storeAuth.user" :to="{ name: 'balance'}" class="w-24 h-10 leading-10 text-center rounded-t-xl
          border-none  text-white select-none bg-gray-400 cursor-pointer hover:bg-gray-500"
          activeClass="bg-gray-800 hover:bg-gray-800">
                  Balance
      </RouterLink>
      <RouterLink  v-show="storeAuth.user" :to="{ name: 'statistics'}" class="w-24 h-10 leading-10 text-center rounded-t-xl
          border-none  text-white select-none bg-gray-400 cursor-pointer hover:bg-gray-500"
          activeClass="bg-gray-800 hover:bg-gray-800">
                  Statistics
      </RouterLink>
      <RouterLink :to="{ name: 'scoreBoard'}" class="w-24 h-10 leading-10 text-center rounded-t-xl
          border-none  text-white select-none bg-gray-400 cursor-pointer hover:bg-gray-500"
          activeClass="bg-gray-800 hover:bg-gray-800">
                  Score Board
      </RouterLink>
      <span class="grow"></span>
      <RouterLink v-show="!storeAuth.user" :to="{ name: 'login'}" class="w-24 h-10 leading-10 text-center rounded-t-xl
          border-none  text-white select-none bg-gray-400 cursor-pointer hover:bg-gray-500"
          activeClass="bg-gray-800 hover:bg-gray-800">
                  Login
      </RouterLink>
      <button v-show="storeAuth.user" @click="logout" class="w-24 h-10 leading-10 text-center rounded-t-xl
          border-none  text-white select-none bg-gray-400 cursor-pointer hover:bg-gray-500">
                  Logout
      </button>
    </nav>
    <RouterView></RouterView>
  </div>
</template>
