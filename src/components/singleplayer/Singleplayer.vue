<script setup>
import { useAuthStore } from '@/stores/auth'

const storeAuth = useAuthStore()
</script>

<template>
  <h1>SINGLEPLAYER PAGE</h1>
  <h5 v-if="storeAuth.userFirstLastName">User succesfully logged in: {{ storeAuth.userFirstLastName}}</h5>
</template>