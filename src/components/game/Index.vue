<script setup>
import { ref } from 'vue';
import Singleplayer from './Singleplayer.vue';
import Singleplayer_Board from './Singleplayer_Board.vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();


const gameData = ref(authStore.user?.id ?{
  created_user_id: authStore.user.id, 
  winner_user_id: '',
  type: '',
  status: '',
  began_at: '',
  ended_at: '',
  total_time: '',
  board_id: '',
  custom: '',
  created_at: '',
  updated_at: '',
  total_turns_winner: ''
}: null);

const router = useRouter();

function selectGameType(gameType) {
  // Atualiza gameData com o tipo selecionado
  if (gameData.value) {
    gameData.value.type = gameType; // Se estiver logado, atualiza o tipo
  }
  
  // Passar os dados ao navegar para o Singleplayer, agora como query params
  if (gameType === 'S') {
    // Se o usuário estiver logado, envia os dados
    if (authStore.user?.id) {
      router.push({
        name: 'singleplayer',
        query: { gameData: JSON.stringify(gameData.value) }
      });
    } else {
      // Se não estiver logado, apenas vai para o singleplayer sem dados
      router.push({ name: 'singleplayer' });
    }
  } else if (gameType === 'M') {
    // Se for multiplayer, pode ir sem dados (mesmo para anônimos)
    router.push({ name: 'multiplayer' });
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col justify-start items-center p-6 pt-20">
    <h1 class="text-5xl font-bold text-yellow-600 mb-4 animate-bounce">Let’s Play!</h1>
    
    <p class="text-lg text-yellow-800 mb-8">Choose your game mode</p>

    <div class="flex gap-6 mb-12">
      <RouterLink 
        :to="{ name: 'singleplayer' }" 
        @click.prevent="selectGameType('S')"
        class="px-8 py-4 text-xl font-semibold text-yellow-50 bg-yellow-500 rounded-full shadow-md hover:bg-yellow-400 transform hover:scale-110 transition-all">
        Singleplayer
      </RouterLink>

      <RouterLink 
        v-if="authStore.user"
        :to="{ name: 'multiplayer' }" 
        @click.prevent="selectGameType('M')"
        class="px-8 py-4 text-xl font-semibold text-yellow-50 bg-yellow-500 rounded-full shadow-md hover:bg-yellow-400 transform hover:scale-110 transition-all">
        Multiplayer
      </RouterLink>
    </div>

    <br><br>

    <div class="w-full max-w-3xl bg-yellow-100 p-8 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-yellow-600 mb-4">How to Play</h2>
      <ul class="list-disc list-inside text-yellow-800 space-y-2">
        <li>Click on cards to reveal them.</li>
        <li>Match pairs of identical cards.</li>
        <li>Complete the game in the shortest time possible!</li>
      </ul>
    </div>
  </div>
</template>