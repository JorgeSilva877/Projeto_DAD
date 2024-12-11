<script setup>
import { Button } from '@/components/ui/button';
import Singleplayer_Board from './Singleplayer_Board.vue';
import Singleplayer from './Singleplayer.vue';
import ListGamesLobby from './ListGamesLobby.vue';
import { useLobbyStore } from '@/stores/lobby'

const storeLobby = useLobbyStore()

</script>

<template>
  <div class="flex flex-wrap justify-center space-x-4">
    <div class="space-x-4">
      <Button @click="storeLobby.addGame('4x4')">
        New Game 4x4
      </Button>
      <Button @click="storeLobby.addGame('6x6')">
        New Game 6x6
      </Button>
      <br>
      <div v-if="storeLobby.totalGames > 0">
        <ListGamesLobby></ListGamesLobby>
      </div>

    </div>

  </div>
</template>