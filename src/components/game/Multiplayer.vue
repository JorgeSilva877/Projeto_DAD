<script setup>
import { Button } from '@/components/ui/button';
import Chat from '@/components/chat/Chat.vue';
import ListGamesLobby from './ListGamesLobby.vue';
import { useLobbyStore } from '@/stores/lobby';
import Singleplayer_Board from './Singleplayer_Board.vue';

const storeLobby = useLobbyStore();
</script>

<template>
  <div class="flex flex-wrap justify-center space-x-4">
    <div class="space-y-4 text-center">
      <div class="space-x-4">
        <Button class="bg-yellow-500 hover:bg-yellow-400 text-white font-semibold py-2 px-4 rounded-lg" @click="storeLobby.addGame('4x4')">
          New Game 4x4
        </Button>
        <Button class="bg-yellow-500 hover:bg-yellow-400 text-white font-semibold py-2 px-4 rounded-lg" @click="storeLobby.addGame('6x6')">
          New Game 6x6
        </Button>
      </div>
      <div 
        v-if="storeLobby.totalGames > 0" 
        class="flex justify-center">
        <ListGamesLobby></ListGamesLobby>
      </div>
      <div>
        <Chat class="w-72"></Chat>
      </div>
      
    </div>
  </div>
</template>
