<script setup>
import { ref, onMounted, computed, watch } from 'vue'

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

// Cria um contador reativo para armazenar o número de cliques
const contadorDeClicks = ref(0)
const aux = ref(0)
const processing = ref(false)

// Função para virar as cartas ao 2 click e verificar se são iguais
const checkCards = (piece) => {

  contadorDeClicks.value++

  if (contadorDeClicks.value == 2) {

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
      myArray.value.push(i - 6);
      //console.log(myArray.value);
      continue;
    }
    myArray.value.push(i);
  }
  myArray.value = myArray.value.sort(() => Math.random() - 0.5);
})
</script>

<template>
    <div :style="gridStyle" class="w-full max-w-screen-md mx-auto">
      <div v-for="piece in board" :key="piece.num" @click="handleClick(piece)"
        class="text-lg font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105 flex items-center justify-center">
        <img :src="getImgSrc(piece)" alt="Carta" class="h-full w-full object-contain p-1">
      </div>
    </div>
</template>
  