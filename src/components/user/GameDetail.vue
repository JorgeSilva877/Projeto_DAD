<script setup>

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game';

const storeGame = useGameStore()
const router = useRouter()
const gameDetails = ref(null)

const props = defineProps({
  id: {
    type: Number,
    required: true,
  }
});

onMounted(() => {
    gameDetails.value = storeGame.getGameDetail(props.id).value
    storeGame.fetchMultiplayerGameUsersDetail(props.id)
});

const back = () => {
    router.back()
}
</script>


<template>
    <div class="p-6 max-w-4xl mx-auto bg-yellow-50 shadow-lg rounded-lg">
      <div v-if="gameDetails">
        <!-- Título -->
        <h1 class="text-3xl font-bold text-yellow-700 mb-6">
          Game Details - 
          <span class="text-yellow-900">
            {{ gameDetails.type === 'S' ? 'Singleplayer' : 'Multiplayer' }}
          </span>
        </h1>
  
        <!-- Grid de Detalhes -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow">
          <div>
            <h2 class="font-semibold text-yellow-700">Starting Date & Time:</h2>
            <p class="text-yellow-900">{{ gameDetails.began_at }}</p>
          </div>
          <div>
            <h2 class="font-semibold text-yellow-700">Board:</h2>
            <p class="text-yellow-900">{{ gameDetails.board }}</p>
          </div>
          <div>
            <h2 class="font-semibold text-yellow-700">Status:</h2>
            <p class="text-yellow-900">
              {{
                gameDetails.status === 'E'
                  ? 'Ended'
                  : gameDetails.status === 'I'
                  ? 'Interrupted'
                  : gameDetails.status === 'PE'
                  ? 'Pending'
                  : 'Playing'
              }}
            </p>
          </div>
          <div>
            <h2 class="font-semibold text-yellow-700">Game Time:</h2>
            <p class="text-yellow-900">{{ gameDetails.gameTime || 'N/A' }}</p>
          </div>
          <div>
            <h2 class="font-semibold text-yellow-700">{{ gameDetails.type === 'S' ? 'Total Turns:' : 'Total Winner Turns:'}}</h2>
            <p class="text-yellow-900">{{ gameDetails.total_turns || 'N/A' }}</p>
          </div>
          <div v-if="gameDetails.type === 'M'">
            <h2 class="font-semibold text-yellow-700">Pairs Discovered</h2>
            <p class="text-yellow-900">{{ gameDetails.total_pairs_discovered || 'N/A' }}</p>
          </div>
          <div v-if="gameDetails.type === 'M'">
            <h2 class="font-semibold text-yellow-700">Game Creator Nickname</h2>
            <p class="text-yellow-900">{{ gameDetails.creator || 'N/A' }}</p>
          </div>
          <div v-if="gameDetails.type === 'M'">
            <h2 class="font-semibold text-yellow-700">Winner Nickname</h2>
            <p class="text-yellow-900">{{ gameDetails.winner || 'N/A' }}</p>
          </div>
        </div>
        <div v-if="storeGame.getMultiplayerGameUsers.length" class="mt-8">
          <h2 class="text-2xl font-bold text-yellow-700 mb-4">Players List</h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="player in storeGame.getMultiplayerGameUsers" 
                :key="player.nickname" 
                class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
              <h3 class="text-lg font-semibold text-yellow-800">{{ player.nickname }}</h3>
              <p class="text-yellow-900 mt-2">Pairs Discovered: <span class="font-medium">{{ player.pairs_discovered }}</span></p>
            </div>
          </div>
        </div>
  
        <!-- Botão -->
        <div class="mt-8 flex justify-center">
          <button @click="back" class="bg-yellow-500 text-white font-medium px-6 py-3 rounded-lg hover:bg-yellow-600 transition shadow-md">
            Go Back
          </button>
        </div>
      </div>
    </div>
  </template>
  