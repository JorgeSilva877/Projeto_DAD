<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/game'

const storeGame = useGameStore()

const loading = ref(false)
const selectedType = ref('')
const selectedStatus = ref('')

onMounted(() => {
    fetchData(true);
});

const fetchData = async (resetPagination = false) => {
    loading.value = true
    storeGame.filters = {
        type: selectedType.value,
        status: selectedStatus.value,
    }
    await storeGame.fetchGames(resetPagination)
    loading.value = false
}


const filteredGames = computed(() => storeGame.getAllGames);

const handleFiltersChange = async () => {
   
        await fetchData(true);
}

const loadMore = async () => {
    loading.value = true
    await storeGame.fetchGamesNextPage()
    loading.value = false
}

</script>

<template>
    <div class="p-6">
      <h1 class="text-3xl font-bold text-yellow-800">Game History</h1>
      
      <div class="mb-4 flex gap-2 mt-6">
        <select v-model="selectedType" @change="handleFiltersChange" class="px-4 py-2 rounded-lg">
          <option value="">All Types</option>
          <option value="S">Singleplayer</option>
          <option value="M">Multiplayer</option>
        </select>
        <select v-model="selectedStatus" @change="handleFiltersChange" class="px-4 py-2 rounded-lg">
          <option value="">All Status</option>
          <option value="PE">Pending</option>
          <option value="PL">Playing</option>
          <option value="E">Ended</option>
          <option value="I">Interrupted</option>
        </select>
      </div>

      <div class="overflow-auto">
        <table class="w-full bg-white rounded-lg shadow-md">
          <thead class="bg-yellow-300">
            <tr>
              <th class="py-3 px-4 text-yellow-800">Game Type</th>
              <th class="py-3 px-4 text-yellow-800">Starting Date & Time</th>
              <th class="py-3 px-4 text-yellow-800">Status</th>
              <th class="py-3 px-4 text-yellow-800">Created By</th>
              <th class="py-3 px-4 text-yellow-800">Winner</th>
              <th class="py-3 px-4 text-yellow-800">Total Time</th>
              <th class="py-3 px-4 text-yellow-800">Action</th>
            </tr>
          </thead>
          <tbody class="text-center">
            <tr v-for="game in filteredGames" :key="game.id" class="border-b hover:bg-yellow-100">
              <td class="py-3 px-4">{{ game.type == 'S' ? 'Singleplayer' : 'Multiplayer' }}</td>
              <td class="py-3 px-4">{{ game.began_at }}</td>
              <td class="py-3 px-4">{{ game.status == 'E' ? 'Ended' : game.status == 'I' ? 'Interrupted' : game.status == 'PE' ? 'Pending' : 'Playing' }}</td>
              <td class="py-3 px-4">{{ game.created_by?.name || '-' }}</td>
              <td class="py-3 px-4">{{ game.winner?.name || '-' }}</td>
              <td class="py-3 px-4">{{ game.total_time ? `${game.total_time}s` : '-' }}</td>
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
            <tr v-if="!filteredGames.length">
              <td colspan="6" class="py-4">No games found</td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-center mt-4">
          <button @click="loadMore" class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
            Load More
          </button>
        </div>
      </div>
    </div>
</template>
