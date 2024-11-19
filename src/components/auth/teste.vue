<script setup>
import { ref } from 'vue'
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
</script>

<template>
  <h1>Loggaste</h1>
</template>