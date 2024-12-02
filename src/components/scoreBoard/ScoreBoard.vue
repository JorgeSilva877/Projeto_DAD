<script setup>
import { ref } from 'vue'
import MultiplayerMostWins from './MultiplayerMostWins.vue'
import SingleplayerBestTime from './SingleplayerBestTime.vue'
import SingleplayerLessTurns from './SingleplayerLessTurns.vue'
import NoBoardscoreData from './NoBoardscoreData.vue'
import { useGameStore } from '@/stores/game'

const storeGame = useGameStore()

//variaveis para mostrar/esconder os objetos
const showMultiplayerWins = ref(false)
const showSingleplayerBestTime = ref(false)
const showSingleplayerLessMoves = ref(false)
const showBoard1 = ref(false) //board 3x4
const showBoard2 = ref(false) //board 4x4
const showBoard3 = ref(false) //board 6x6

//Dropdown -> Garante que só está um item selecionado de cada vez
const toggleDropdown = (dropdownRequest) => {
  switch(dropdownRequest){
    case 'wins':
      showMultiplayerWins.value = !showMultiplayerWins.value
      showSingleplayerBestTime.value = false;
      showSingleplayerLessMoves.value = false;
      break;
    case 'bestTime':
      showSingleplayerBestTime.value = !showSingleplayerBestTime.value
      showMultiplayerWins.value = false;
      showSingleplayerLessMoves.value = false;
      showBoard1.value = false;
      showBoard2.value = false;
      showBoard3.value = false;
      break;
    case 'lessMoves':
      showSingleplayerLessMoves.value = !showSingleplayerLessMoves.value
      showSingleplayerBestTime.value = false;
      showMultiplayerWins.value = false;
      showBoard1.value = false;
      showBoard2.value = false;
      showBoard3.value = false;
      break;
    case 'b1':
      showBoard1.value = !showBoard1.value;
      showBoard2.value = false;
      showBoard3.value = false;
      break;
    case 'b2':
      showBoard2.value = !showBoard2.value;
      showBoard1.value = false;
      showBoard3.value = false;
      break;
    case 'b3':
      showBoard3.value = !showBoard3.value;
      showBoard2.value = false;
      showBoard1.value = false;
      break;
    default:
      break;
  }
}

</script>

<template>
  <aside class="w-64 bg-gray-100 p-4 border-r">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Score Board</h2>
    
    <div class="mb-4" v-if="!storeGame.getMultiplayerMostWins.length > 0 &&
                            !storeGame.getSinglePlayerBestTime_BoardThreeFour.length > 0 && 
                            !storeGame.getSinglePlayerBestTime_BoardFourFour.length > 0 && 
                            !storeGame.getSinglePlayerBestTime_BoardSixSix.length > 0">
      <NoBoardscoreData></NoBoardscoreData>
    </div>


    <div v-if="storeGame.getMultiplayerMostWins.length > 0" class="mb-4">
      <button @click="toggleDropdown('wins')" class="w-full text-left font-semibold text-gray-800 mb-2">
        🏆 Multiplayer Most Wins
      </button>
      <ul v-show="showMultiplayerWins" class="space-y-4">
        <MultiplayerMostWins :winnersList="storeGame.getMultiplayerMostWins" :readonly="true"></MultiplayerMostWins>
      </ul>
    </div>

    <div v-if="storeGame.getSinglePlayerBestTime_BoardThreeFour.length > 0 || storeGame.getSinglePlayerBestTime_BoardFourFour.length > 0 || storeGame.getSinglePlayerBestTime_BoardSixSix.length > 0" class="mb-4">
      <button @click="toggleDropdown('bestTime')" class="w-full text-left font-semibold text-gray-800 mb-2">
        🏆 Singleplayer Best Time
      </button>
      <ul v-show="showSingleplayerBestTime" class="space-y-2 pl-4">
        <li v-if="storeGame.getSinglePlayerBestTime_BoardThreeFour.length > 0" class="text-gray-700 hover:text-black font-medium">
          <button @click="toggleDropdown('b1')" class="w-full text-left text-gray-800">
            3x4 Board
          </button>
          <ul v-show="showBoard1" class="space-y-4 pl-4">
            <SingleplayerBestTime :winnersList="storeGame.getSinglePlayerBestTime_BoardThreeFour" :readonly="true"></SingleplayerBestTime>
          </ul>
        </li>
        <li v-if="storeGame.getSinglePlayerBestTime_BoardFourFour.length > 0" class="text-gray-700 hover:text-black font-medium">
          <button @click="toggleDropdown('b2')" class="w-full text-left text-gray-800">
            4x4 Board
          </button>
          <ul v-show="showBoard2" class="space-y-4 pl-4">
            <SingleplayerBestTime :winnersList="storeGame.getSinglePlayerBestTime_BoardFourFour" :readonly="true"></SingleplayerBestTime>
          </ul>
        </li>
        <li v-if="storeGame.getSinglePlayerBestTime_BoardSixSix.length > 0" class="text-gray-700 hover:text-black font-medium">
          <button @click="toggleDropdown('b3')" class="w-full text-left text-gray-800">
            6x6 Board
          </button>
          <ul v-show="showBoard3" class="space-y-4 pl-4">
            <SingleplayerBestTime :winnersList="storeGame.getSinglePlayerBestTime_BoardSixSix" :readonly="true"></SingleplayerBestTime>
          </ul>
        </li>
      </ul>
    </div>

    <div v-if="storeGame.getSinglePlayerBestTime_BoardThreeFour.length > 0 || storeGame.getSinglePlayerBestTime_BoardFourFour.length > 0 || storeGame.getSinglePlayerBestTime_BoardSixSix.length > 0" class="mb-4">
      <button @click="toggleDropdown('lessMoves')" class="w-full text-left font-semibold text-gray-800 mb-2">
        🏆 Singleplayer Less Turns
      </button>
      <ul v-show="showSingleplayerLessMoves" class="space-y-2 pl-4">
        <li v-if="storeGame.getSinglePlayerBestTime_BoardThreeFour.length > 0" class="text-gray-700 hover:text-black font-medium">
          <button @click="toggleDropdown('b1')" class="w-full text-left text-gray-800">
            3x4 Board
          </button>
          <ul v-show="showBoard1" class="space-y-4 pl-4">
            <SingleplayerLessTurns :winnersList="storeGame.getSinglePlayerLessTurns_BoardThreeFour" :readonly="true"></SingleplayerLessTurns>
          </ul>
        </li>
        <li v-if="storeGame.getSinglePlayerBestTime_BoardThreeFour.length > 0" class="text-gray-700 hover:text-black font-medium">
          <button @click="toggleDropdown('b2')" class="w-full text-left text-gray-800">
            4x4 Board
          </button>
          <ul v-show="showBoard2" class="space-y-4 pl-4">
            <SingleplayerLessTurns :winnersList="storeGame.getSinglePlayerLessTurns_BoardFourFour" :readonly="true"></SingleplayerLessTurns>
          </ul>
        </li>
        <li v-if="storeGame.getSinglePlayerBestTime_BoardThreeFour.length > 0" class="text-gray-700 hover:text-black font-medium">
          <button @click="toggleDropdown('b3')" class="w-full text-left text-gray-800">
            6x6 Board
          </button>
          <ul v-show="showBoard3" class="space-y-4 pl-4">
            <SingleplayerLessTurns :winnersList="storeGame.getSinglePlayerLessTurns_BoardSixSix" :readonly="true"></SingleplayerLessTurns>
          </ul>
        </li>
      </ul>
    </div>

    

  </aside>
</template>