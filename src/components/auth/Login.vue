<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'

const storeAuth = useAuthStore()
const storeError = useErrorStore()
const router = useRouter()

const socket = inject('socket')
const msgWebsocket = ref('')

const credentials = ref({
    email: '',
    password: ''
})

const cancel = () => {
    router.back()
}

const login = () => {
  storeAuth.login(credentials.value)
}

const websocketTest = () => {
  socket.emit('echo', msgWebsocket.value)
}
</script>

<template>
  <Card class="w-[450px] mx-auto my-8 p-4 px-8">
    <CardHeader>
      <CardTitle>Login</CardTitle>
      <CardDescription>Enter your credentials to access your account.</CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="User Email"  v-model="credentials.email" v-on:keydown.enter="login"/>
            <ErrorMessage :errorMessage="storeError.fieldMessage('email')"></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="password">Password</Label>
            <Input id="password" type="password" v-model="credentials.password" v-on:keydown.enter="login"/>
            <ErrorMessage :errorMessage="storeError.fieldMessage('password')"></ErrorMessage>
            
            <Label>Web-Socket Test</Label>
            <Input id="websocket" placeholder="WebSocket echo"  v-model="msgWebsocket"/>
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-between px-6 pb-6">
        <Button variant="outline" @click="cancel">
            Cancel
        </Button>
        <Button class="bg-yellow-500 hover:bg-yellow-400 text-white font-semibold py-2 px-4 rounded-lg" @click="login">
            Login
        </Button>
        <Button class="bg-yellow-500 hover:bg-yellow-400 text-white font-semibold py-2 px-4 rounded-lg" @click="websocketTest">
            Websocket Teste
        </Button>
    </CardFooter>
  </Card>
</template>