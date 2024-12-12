<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from '@/stores/game';
import { useAuthStore } from '@/stores/auth';
import { useErrorStore } from '@/stores/error'
import { useTransactionStore } from '@/stores/transactionStore';
import { format } from 'date-fns';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const storeError = useErrorStore()
const gameStore = useGameStore();
const transactionStore = useTransactionStore();

const transaction = ref({
  type: 'I', 
  transaction_datetime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
  user_id: authStore.user.id,
  game_id: null,
  euros: null,
  payment_type: null,
  payment_reference: null,
  brain_coins: '',
  custom: JSON.stringify({}),
});

const game = ref({
  type : 'S',
  created_user_id : authStore.user.id,
  winner_user_id : null,
  status : null,
  began_at : null,
  ended_at : null,
  board_id : null,
  total_time : null,
  board_id : null,

});

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

  game.value.board_id = boardId;
  game.value.status = "PL";

  
  try {
    // Inicia um novo jogo
    const newGameData = await gameStore.startGame(game.value);
    console.log('Novo jogo iniciado com sucesso:', newGameData);
    await authStore.refreshUser();

    const gameId = newGameData.id;
    if(boardId !==1) {
      transaction.value.brain_coins = -1;
      //console.log('gameId', newGameData.id);
      transaction.value.game_id = gameId;
      //console.log('gameid:', transaction.value.game_id);
      transactionStore.insertTransaction(transaction.value);
    }
    // Navega para a rota do tabuleiro com os dados do jogo atualizados
    if(authStore.userCurrentBalance < 1 && gameStore.currentGame.board_id !== 1) {
      storeError.setErrorMessages('Saldo insuficiente para jogar');
      return;
    }
    gameStore.currentGame = newGameData;

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