<script setup>
import { onMounted, useTemplateRef, provide, ref } from 'vue'
import { RouterView } from 'vue-router'
import Toaster from '@/components/ui/toast/Toaster.vue'
import GlobalAlertDialog from '@/components/common/GlobalAlertDialog.vue'
import { useAuthStore } from '@/stores/auth'
import { useGameStore } from '@/stores/game'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu'
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import ScoreBoard from './components/scoreBoard/ScoreBoard.vue'

const storeAuth = useAuthStore()
const storeGame = useGameStore()

onMounted(() => {
  storeGame.fetchScoreboard();
})


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
  <div class="flex flex-col h-screen">
    <div class="flex flex-1">
      <ScoreBoard></ScoreBoard>
      <div class="w-full max-w-[90%] lg:max-w-[80%] mx-auto">
      <div class="flex justify-between">
        <RouterLink :to="storeAuth.userType == 'A' ? '/dashboard' : '/'">
            <h1 class="memory-title">Memory Game</h1>
        </RouterLink>
        <NavigationMenu>
          <NavigationMenuLink v-if="!(storeAuth.userType == 'A')">
            <RouterLink :to="{ name: 'aboutUs'}" :class="navigationMenuTriggerStyle()">About us</RouterLink>
          </NavigationMenuLink>
          <NavigationMenuLink v-if="!storeAuth.user">
            <RouterLink :to="{ name: 'login'}" :class="navigationMenuTriggerStyle()">Login</RouterLink>
          </NavigationMenuLink>
          <NavigationMenuLink v-if="storeAuth.userType == 'P'">
            <RouterLink :to="{ name: 'addBalance'}" :class="navigationMenuTriggerStyle()">{{ storeAuth.userCurrentBalance }}$</RouterLink>
          </NavigationMenuLink>

          <NavigationMenuList v-if="storeAuth.userType == 'A'">
            <NavigationMenuItem>
              <DropdownMenu v-if="storeAuth.user">
                <DropdownMenuTrigger :class="navigationMenuTriggerStyle()">
                  Admin tools
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  class="bg-white shadow-lg rounded-md p-2 w-40" >
                  <DropdownMenuItem>
                    <RouterLink :to="{ name: 'users'}" :class="navigationMenuTriggerStyle()">Users</RouterLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RouterLink :to="{ name: 'statistics'}" :class="navigationMenuTriggerStyle()">Statistics</RouterLink>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
          </NavigationMenuList>

          <NavigationMenuList>
            <NavigationMenuItem>
              <DropdownMenu v-if="storeAuth.user">
                <DropdownMenuTrigger :class="navigationMenuTriggerStyle()">
                  {{ storeAuth.userFirstLastName }}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  class="bg-white shadow-lg rounded-md p-2 w-40" >
                  <DropdownMenuItem>
                    <RouterLink :to="{ name: 'viewProfile'}" class="w-full text-left text-gray-700 hover:text-black hover:bg-gray-100 px-2 py-1 rounded">
                      Profile
                    </RouterLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RouterLink :to="{ name: 'addBalance'}" class="w-full text-left text-gray-700 hover:text-black hover:bg-gray-100 px-2 py-1 rounded">
                      Add brain coins
                    </RouterLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RouterLink :to="{ name: 'gamesHistory'}" class="w-full text-left text-gray-700 hover:text-black hover:bg-gray-100 px-2 py-1 rounded">
                      Games History
                    </RouterLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RouterLink :to="{ name: 'transactionHistory'}" class="w-full text-left text-gray-700 hover:text-black hover:bg-gray-100 px-2 py-1 rounded">
                      Transaction History
                    </RouterLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <button @click="logout" class="w-full text-left text-red-600 hover:text-red-800 hover:bg-gray-100 px-2 py-1 rounded">
                      Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <RouterView></RouterView>
    </div>
    </div>
    <footer class="bg-yellow-600 text-white py-4 mt-auto">
        <div class="text-center">
          <p>&copy; 2024 Memory Game. All Rights Reserved.</p>
        </div>
    </footer>
  </div>  
</template>
