<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router';
import { useGameStore } from '@/stores/game';
import { useAuthStore } from '@/stores/auth';


// Ir buscar qual é o tabuleiro que o utilizador escolheu
const props = defineProps({
  rows: {
    type: Number,
    required: true
  },
  cols: {
    type: Number,
    required: true
  }
})

// Cria um array reativo para armazenar os estados das cartas
const board = ref([])
const authStore = useAuthStore();


// Cria um contador reativo para armazenar o número de cliques
const contadorDeClicks = ref(0)
const aux = ref(0)
const processing = ref(false)

const gameStore = useGameStore();

const route = useRoute();
const gameData = ref({});


const endGame = async () => {
  gameData.value.began_at = startDate
  gameData.value.total_time = temporizador.value
  gameData.value.total_turns_winner = tentativas.value
  console.log("Dados do jogo:", gameData.value);  // Verifique a estrutura do objeto
  try {
    await gameStore.endGame(gameStore.currentGame.id , gameData.value);

  } catch (error) {
    console.error('Erro ao iniciar o jogo:', error);
  }
}
// Cria um contador reativo para contar as tentativas
const tentativas = ref(0)

// Cria um temporizador reativo para contar o tempo

const temporizador = ref(0)
const startTimer = ref(false)
let timerInterval = null

let startDate = null
// Computed para verificar se o jogo terminou
const isGameOver = computed(() => {
  console.log('tempo1' , temporizador.value);
  return board.value.every(card => !card.hidden) // Todas as cartas viradas?
});
// Função para contar o tempo
const timer = () => {
  temporizador.value++
  console.log('Tempo:', temporizador.value);
}

// Watcher para parar o contador quando o jogo terminar
watch(isGameOver, (newValue) => {
  if (newValue) {
    clearInterval(timerInterval); // Para o timer
    timerInterval = null; // Limpa a referência para evitar chamadas duplicadas
    console.log('Jogo terminado! Temporizador parado.');
    if (authStore.user) {
      endGame()
    }
  }
});

// Obtem a data atual
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



// Função para virar as cartas ao 2 click e verificar se são iguais
const checkCards = (piece) => {

  contadorDeClicks.value++

  if (contadorDeClicks.value == 2) {
    tentativas.value++

    contadorDeClicks.value = 0;
    const indexToHide = aux.value; //variavel auxiliar pois depois de 1h a dar debug descobri que o timeout nao para a execução codigo fora dele......

    if (myArray.value[piece.num] == myArray.value[aux.value]) {
      console.log('Cartas iguais');

    } else {
      processing.value = true //bloquear cliques
      setTimeout(() => { //timeout para dar tempo de ver as cartas
        board.value[indexToHide].hidden = true
        piece.hidden = true
        processing.value = false
      }, 700);
    }
  }
  aux.value = piece.num;
}

// Função para alternar o estado da carta clicada
const handleClick = (piece) => {

  // Iniciar o temporizador
  if (!startTimer.value) {
    startTimer.value = true
    startDate = getDate()
    console.log('Temporizador iniciado:', startDate);
    timerInterval = setInterval(timer, 1000);

  }

  if (processing.value) { //pa n deixar clicar enquanto ta a mostrar as 2 cartas viradas
    return;
  }
  // Não permitir clicar na mesma carta duas vezes
  if (!piece.hidden) {
    return;
  }
  //console.log('Clicou na peça', piece.num)
  piece.hidden = false // revelamos a carta
  checkCards(piece)
}

// Computed para calcular dinamicamente o tamanho dos quadrados e layout do grid (chatgpt fez esta funcao, n me perguntem)
const gridStyle = computed(() => {
  const maxContainerSize = 600; // Tamanho máximo do tabuleiro (em px)
  const squareSize = Math.floor(maxContainerSize / Math.max(props.rows, props.cols)); // Tamanho proporcional dos quadrados
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${props.cols}, ${squareSize}px)`,
    gridTemplateRows: `repeat(${props.rows}, ${squareSize}px)`,
    gap: '10px', // Espaçamento fixo entre os quadrados
    justifyContent: 'center'
  };
})

const myArray = ref([]); // Array para armazenar as cartas

// Função para retornar a imagem correta com base no estado
const getImgSrc = (piece) => {
  if (piece.hidden) {
    return '/app_icon.png' // Imagem "virada"
  }
  return `/${myArray.value[piece.num]}.png` // Imagem "revelada"
}

onMounted(() => {
  console.log('Componente montado')
  for (let i = 0; i < props.rows * props.cols; i++) {
    board.value.push({
      num: i,
      hidden: true
    })
    if (i >= (props.rows * props.cols) / 2) { // para garantir q ha 2 cartas de cada
      myArray.value.push(i - (props.rows * props.cols) / 2);
      //console.log(myArray.value);
      continue;
    }
    myArray.value.push(i);
  }
  myArray.value = myArray.value.sort(() => Math.random() - 0.5);

  if (route.query.gameData) {

    const parsedGameData = JSON.parse(route.query.gameData);
    gameStore.currentGame = parsedGameData;
    // Converte a string JSON de volta para um objeto
    //gameData.value = JSON.parse(route.query.gameData);
    console.log('Game Data no Board:', gameStore.currentGame.game);

  }
})
</script>

<template>


  <div v-if="isGameOver">
    <div class="flex flex-col justify-center items-center">
      <div class="bg-green-500 text-white text-xl font-bold py-4 px-8 rounded-lg shadow-lg mt-10">
        Parabéns, ganhou o jogo em {{ temporizador }} segundos e {{ tentativas }} tentativas.
      </div>
      <div class="flex items-center justify-center mt-5">
        <RouterLink :to="{ name: 'index' }"
          class="ml-2 px-3 py-3 text-lg font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
          </svg>
        </RouterLink>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="text-3xl text-center font-bold text-gray-700 relative font-tahoma uppercase mb-5 ">

      Tempo: {{ startTimer ? temporizador : '--' }}

    </div>
    <div :style="gridStyle" class="w-full max-w-screen-md mx-auto mt-10">
      <div v-for="piece in board" :key="piece.num" @click="handleClick(piece)"
        class="text-lg font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105 flex items-center justify-center">
        <img :src="getImgSrc(piece)" alt="Carta" class="h-full w-full object-contain p-1">
      </div>
    </div>
  </div>
  <br>
</template>