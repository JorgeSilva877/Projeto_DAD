<script setup>

import { onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const storeGame = useGameStore()

const props = defineProps({
  id: {
    type: Number,
    required: true,
  }
});

const badgeClass = (position) => {
      return {
        "bg-yellow-500 text-white": position === 1,
        "bg-gray-400 text-white": position === 2,
        "bg-amber-800 text-white": position === 3,
      };
}

const back = () => {
    router.back()
}

onMounted(() => {
    storeGame.fetchPersonalScoreboard(props.id)
});

</script>
  
  
<template>
    <div class="min-h-screen bg-yellow-50 p-8">
      <h1 class="text-4xl font-bold text-yellow-800 text-center mb-8">🏆 My Scoreboard</h1>
      
      <p class="text-2xl font-semibold text-yellow-700 mb-4 text-left">Best Time</p>
      <!--BEST TIME-->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">        
        
        <div v-for="(games, board) in storeGame.getPersonalScoreboardByTime" class="bg-yellow-100 shadow-lg rounded-xl p-6">
          <h2 class="text-2xl font-semibold text-yellow-800 mb-4 text-center">{{ board }} Board</h2>
          
          <div v-for="(game, index) in games" class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-yellow-200 rounded-lg">
              <div :class="badgeClass(index+1)" class="w-10 h-10 rounded-full flex items-center justify-center">
                🥇
              </div>
              <span class="text-2xl font-bold text-yellow-800">{{ game.time }}s</span>
            </div>
          </div>
        </div>
        
      </div>


      <!--LESS TURNS-->
      <br><br>
      <p class="text-2xl font-semibold text-yellow-700 mb-4 text-left">Less Turns</p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">        
        
        <div v-for="(games, board) in storeGame.getPersonalScoreBoardByMoves" class="bg-yellow-100 shadow-lg rounded-xl p-6">
          <h2 class="text-2xl font-semibold text-yellow-800 mb-4 text-center">{{ board }} Board</h2>
          
          <div v-for="(game, index) in games" class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-yellow-200 rounded-lg">
              <div :class="badgeClass(index+1)" class="w-10 h-10 rounded-full flex items-center justify-center">
                🥇
              </div>
              <span class="text-2xl font-bold text-yellow-800">{{ game.turns }} turns</span>
            </div>
          </div>
        </div>
      
      </div>

      <div class="flex justify-center items-center ">
            <button @click="back" class="mt-8 px-6 py-2 text-white font-semibold bg-yellow-600 rounded-lg hover:bg-yellow-700 transition">
                Back
            </button>
      </div>

    </div>
  </template>
  
  