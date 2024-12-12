<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from '@/stores/game';
import { useAuthStore } from '@/stores/auth';
import { useErrorStore } from '@/stores/error'

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const storeError = useErrorStore()
const gameStore = useGameStore();

// Quando o componente for montado, analisa os dados da query e define o gameData
onMounted(() => {
  if(authStore.user) {
    if (route.query.gameData) {
      // Converte a string JSON de volta para um objeto e atualiza o estado global
      const parsedGameData = JSON.parse(route.query.gameData);
      gameStore.currentGame = parsedGameData;
      console.log('Game Data recebido em Singleplayer:', gameStore.currentGame);
    }
  }
});

function getDate() {
  const now = new Date();

  // Formatar a data
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Mês começa de 0, por isso somamos 1, o pad garante que a data tenha sempre 2 caracteres
  const day = String(now.getDate()).padStart(2, '0');

  // Formatar a hora
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // Montar a data no formato desejado
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


const handleBoardSelection = async (boardId, routeName) => {
  gameStore.currentGame.board_id = boardId;
  gameStore.currentGame.created_at = getDate();
  gameStore.currentGame.status = "PL"; // P para "Playing"
  
  try {
    // Inicia um novo jogo
    const newGameData = await gameStore.startGame(gameStore.currentGame);
    console.log('Novo jogo iniciado com sucesso:', newGameData);
    await authStore.refreshUser();

    // Navega para a rota do tabuleiro com os dados do jogo atualizados
    if(authStore.userCurrentBalance < 1 && gameStore.currentGame.board_id !== 1) {
      storeError.setErrorMessages('Saldo insuficiente para jogar');
      return;
    }
    router.push({
      name: routeName,
      query: { gameData: JSON.stringify(newGameData) },
    });
  }catch (error) {
    console.error('Erro ao iniciar o jogo:', error);
    alert(error.message || 'Erro ao iniciar o jogo. Tente novamente.');
  }
};
</script>


<template>
  <div class="min-h-screen flex flex-col justify-start items-center p-6 pt-20">
    <h1 class="text-5xl font-bold text-yellow-600 mb-8">Choose Your Board</h1>

    <div v-if="!authStore.user" class="flex justify-center gap-8">
      <RouterLink 
        :to="{ name: 'singleplayer_3x4' }" 
        class="px-8 py-4 text-xl font-semibold text-yellow-50 bg-yellow-500 rounded-lg shadow-lg hover:bg-yellow-400 transform hover:-translate-y-1 hover:scale-105 transition-all">
        3x4
      </RouterLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
      <button 
        @click="handleBoardSelection(1, 'singleplayer_3x4')"
        class="px-8 py-4 text-xl font-semibold text-yellow-50 bg-yellow-500 rounded-lg shadow-lg hover:bg-yellow-400 transform hover:-translate-y-1 hover:scale-105 transition-all">
        3x4
      </button>  
      
      <button 
        @click="handleBoardSelection(2, 'singleplayer_4x4')"
        class="px-8 py-4 text-xl font-semibold text-yellow-50 bg-yellow-500 rounded-lg shadow-lg hover:bg-yellow-400 transform hover:-translate-y-1 hover:scale-105 transition-all">
        4x4
      </button>
      
      <button 
        @click="handleBoardSelection(3, 'singleplayer_6x6')"
        class="px-8 py-4 text-xl font-semibold text-yellow-50 bg-yellow-500 rounded-lg shadow-lg hover:bg-yellow-400 transform hover:-translate-y-1 hover:scale-105 transition-all">
        6x6
      </button>
    </div>
  </div>
</template>