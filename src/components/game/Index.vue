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
      <h1 class="text-4xl mb-2 text-center">Lets Play!</h1>
      <p class="text-xl text-gray-600 text-center mb-4">Choose your game mode</p>
  
      <div v-if="!authStore.user" class="flex justify-center gap-4">
        <RouterLink 
          :to="{ name: 'singleplayer' }" 
          @click.prevent="selectGameType('S')"
          class="px-6 py-3 text-lg font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105">
          Singleplayer
        </RouterLink>
        
      </div>
      <div v-else class="flex justify-center gap-4">
        <RouterLink 
          :to="{ name: 'singleplayer' }" 
          @click.prevent="selectGameType('S')"
          class="px-6 py-3 text-lg font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105">
          Singleplayer
        </RouterLink>
        <RouterLink 
          :to="{ name: 'multiplayer' }" 
          @click.prevent="selectGameType('M')"
          class="px-6 py-3 text-lg font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105">
          Multiplayer
        </RouterLink>
      </div>
</template>


  <div class="flex justify-center gap-4">
    <RouterLink :to="{ name: 'singleplayer' }"
      class="px-6 py-3 text-lg font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105">
      Singleplayer
    </RouterLink>
    <RouterLink :to="{ name: 'multiplayer' }"
      class="px-6 py-3 text-lg font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105">
      Multiplayer
    </RouterLink>
  </div>
</template>
