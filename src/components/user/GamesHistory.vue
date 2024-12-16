<script setup>

import { onMounted, ref, computed } from 'vue'
import { useGameStore } from '@/stores/game';
import { useAuthStore } from '@/stores/auth';

const storeGame = useGameStore()
const storeAuth = useAuthStore()
const G_userID = ref(null);

onMounted(() => {
  if(storeAuth.userType === 'A') {
    storeGame.fetchGames();
  }else{
    const userID = storeAuth.userId
    storeGame.fetchPersonalGames(userID);
    G_userID.value = userID;
  }
})


//filtro
const filterType = ref('');
const filteredGames = computed(() => {
  if (filterType.value === '') {
    return storeAuth.userType == 'P' ? storeGame.getPersonalGames : storeGame.getAllGames;
  }
  return storeAuth.userType == 'P' ? storeGame.getPersonalGames.filter(game => game.type === filterType.value) : storeGame.getAllGames.filter(game => game.type === filterType.value);
});

</script>

<template>
    <div class="p-6">

      <!-- Titulo + Botoes -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-yellow-800">Game History</h1>
        <div v-if="storeAuth.userType == 'P' && storeGame.getPersonalGames.length > 0" class="flex gap-4">
          <RouterLink :to="'/gamesHistory/scoreboard/'+G_userID">
            <button class="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition">
              Personal Scoreboard
            </button>
          </RouterLink>
        </div>
      </div>


      <div class="overflow-auto">
        <div v-if="filteredGames.length > 0">

                  <!-- Filtros -->
            <div class="mb-4 flex gap-2">
              <button @click="filterType = ''" :class="filterType === '' ? 'bg-yellow-600' : 'bg-yellow-400'" class="text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-500 transition">
                All
              </button>
              <button @click="filterType = 'S'" :class="filterType === 'S' ? 'bg-yellow-600' : 'bg-yellow-400'" class="text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-500 transition">
                Singleplayer
              </button>
              <button @click="filterType = 'M'" :class="filterType === 'M' ? 'bg-yellow-600' : 'bg-yellow-400'" class="text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-500 transition">
                Multiplayer
              </button>
            </div>


            <!-- Header da tabela -->
            <table class="w-full bg-white rounded-lg shadow-md overflow-hidden">
              <thead class="bg-yellow-300 ">
                <tr>
                  <th class="py-3 px-4 text-center text-yellow-800">Game Type</th>
                  <th class="py-3 px-4 text-center text-yellow-800">Starting Date & Time</th>
                  <th class="py-3 px-4 text-center text-yellow-800">Board</th>
                  <th class="py-3 px-4 text-center text-yellow-800">Status</th>
                  <th class="py-3 px-4 text-center text-yellow-800">Game Time</th>
                  <th class="py-3 px-4 text-center text-yellow-800">{{ storeAuth.userType == 'P' ? 'Total Turns' : 'Winner' }} </th>
                  <th class="py-3 px-4 text-center text-yellow-800">Actions</th>
                </tr>
              </thead>
              <!-- Conteudo da tabela -->
              <tbody class="text-center">
                <tr v-for="game in filteredGames" class="border-b hover:bg-yellow-100 transition">
                  <td class="py-3 px-4 text-yellow-800">{{ game.type == 'S' ? 'Singleplayer' : 'Multiplayer' }}</td>
                  <td class="py-3 px-4 text-yellow-800">{{ game.began_at }}</td>
                  <td class="py-3 px-4 text-yellow-800">{{ game.board }}</td>
                  <td class="py-3 px-4 text-yellow-800">{{ game.status == 'E' ? 'Ended' : 
                                                          game.status == 'I' ?  'Interrupted' : 
                                                          game.status == 'PE' ? 'Pending' : 
                                                          'Playing'}}</td>
                  <td class="py-3 px-4 text-yellow-800">{{ game.gameTime == null ? 'N/A' :  game.gameTime}}</td>
                  <td v-if="storeAuth.userType == 'P'" class="py-3 px-4 text-yellow-800">{{ game.total_turns == null ? 'N/A' : game.total_turns }}</td>
                  <td v-else class="py-3 px-4 text-yellow-800">{{ game.winner == null ? game.creator : game.winner }}</td>
                  <!-- Icon -->
                  <td class="py-3 px-4 text-center">
                    <RouterLink :to="{  name: 'gameDetail', params: { id: game.id } }" >
                      <button class="bg-yellow-400 text-yellow-800 p-2 rounded-full hover:bg-yellow-500 transition">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.5"
                          class="w-6 h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 5C7 5 3.5 8.5 2 12c1.5 3.5 5 7 10 7s8.5-3.5 10-7c-1.5-3.5-5-7-10-7z"
                          />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </RouterLink>
                  </td>
                </tr>
              </tbody>
            </table>
        </div>
        <p v-else>Nothing to Show</p>
      </div>
    </div>
</template>

