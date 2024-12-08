<script setup>
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const storeAuth = useAuthStore();
</script>

<template>
  <h1 class="text-3xl mb-2 text-center text-yellow-500 font-semibold">Add Brain Coins</h1>
  <p class="text-lg text-gray-400 text-center mb-4">Choose your balance</p>  
  <div class="flex flex-col items-center justify-start min-h-screen pt-16">
    <div class="w-full max-w-[90%] lg:max-w-[80%] mx-auto">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <RouterLink  v-if="storeAuth.user" v-for="coins in [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200]" :key="coins"
          :to="{ name: 'buyBrainCoins', params: { coins: coins, euros: coins / 10 } }"
          class="sm:w-20 sm:h-24 md:w-24 md:h-28 lg:w-36 lg:h-28 text-lg font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105 flex flex-col items-center justify-center">
          <div>{{ coins }} Brain Coins</div>
          <div class="text-sm text-gray-300 mt-2">{{ coins / 10 }}€</div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>


