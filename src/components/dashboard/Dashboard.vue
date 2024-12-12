<script setup>

import { onMounted, ref } from 'vue';
import { useStatisticsStore } from '@/stores/statistic';

const storeStatistics = useStatisticsStore()

onMounted(() => {
    storeStatistics.fetchAdminDashboard()
});

const getPercentage = (numerador, denominador) => {
  return ((numerador * 100)/ denominador)
}

const registedPlayersGoal = ref(1000);
const earnedMoneyGoal = ref(5000);
const playedGamesGoal = ref(100000);

</script>

<template>
    <div class="container mx-auto">
      <!-- Cabeçalho da Dashboard -->
      <header class="mb-8 text-center">
        <h1 class="text-3xl font-semibold text-yellow-600">Dashboard</h1>
        <p class="text-lg text-yellow-800">Welcome back!</p>
      </header>

      <!-- Global stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-yellow-600">Online players</h2>
          <p class="text-3xl font-bold text-yellow-800">{{ storeStatistics.getUserStats.loggedPlayers }} from {{ storeStatistics.getUserStats.allPlayers }}</p>
          <div class="mt-4">
            <!-- Barra de Progresso -->
            <div class="w-full bg-gray-200 rounded-full h-4">
              <div :style="{ width:  getPercentage(storeStatistics.getUserStats.loggedPlayers, storeStatistics.getUserStats.allPlayers) + '%'}" class="bg-yellow-600 h-4 rounded-full"></div>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-yellow-600">Purchases</h2>
          <p class="text-3xl font-bold text-yellow-800">{{ storeStatistics.getTransactionsStats.totalPurchases }}</p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-yellow-600">Games played</h2>
          <p class="text-3xl font-bold text-yellow-800">{{ storeStatistics.getGamesStats.gamesPlayed }}</p>
        </div>

      </div>


      <!-- Monthly stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-yellow-600">Players registered on this month</h2>
          <p class="text-3xl font-bold text-yellow-800">{{ storeStatistics.getUserStats.registedPlayersThisMonth }}</p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-yellow-600">Purchases on this month</h2>
          <p class="text-3xl font-bold text-yellow-800">{{ storeStatistics.getTransactionsStats.purchasesThisMonth }}</p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-yellow-600">Games played on this month</h2>
          <p class="text-3xl font-bold text-yellow-800">{{ storeStatistics.getGamesStats.gamesPlayedThisMonth }}</p>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white p-6 rounded-lg shadow-md">
            <!-- Gráfico Circular -->
          <h3 class="text-xl font-semibold text-yellow-600">Singleplayer games vs multiplayer games</h3>
          <br><br>
          <div class="flex justify-center items-center">
            <svg class="w-40 h-40" viewBox="0 0 36 36">
              <!-- Fundo do Gráfico -->
              <circle
                class="text-gray-200"
                cx="18" cy="18" r="16"
                stroke="currentColor" stroke-width="4" fill="transparent"
              />
              <!-- Progresso -->
              <circle
                class="text-yellow-600"
                cx="18" cy="18" r="16"
                stroke="currentColor" stroke-width="4" fill="transparent"
                :stroke-dasharray="`${getPercentage(storeStatistics.getGamesStats.MultiplayerGamesPlayed, storeStatistics.getGamesStats.gamesPlayed)}, 100`"
                stroke-linecap="round"
                transform="rotate(-90 18 18)"
              />
            </svg>
          </div>

          <!-- Legenda -->
          <div class="mt-4 flex justify-center space-x-4 text-sm">
            <div class="flex items-center space-x-2">
              <span class="w-4 h-4 inline-block bg-yellow-600 rounded-full"></span>
              <span class="text-gray-700">Multiplayer Games</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="w-4 h-4 inline-block bg-gray-200 rounded-full"></span>
              <span class="text-gray-700">Singleplayer Games</span>
            </div>
          </div>
        </div>


        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold text-yellow-600">Players who deposited the most money</h3>
          <!-- Gráfico de Barras -->
          <div class="relative h-40">
            <div v-for="(item, index) in storeStatistics.getTransactionsStats.playersWithMostMoneyDeposited" :key="index" class="absolute bottom-0" :style="{
              width: 'calc(100% / ' + 6 + ')',
              height: (item.total_spent / storeStatistics.getTransactionsStats.playersWithMostMoneyDeposited[0].total_spent) * 80 + '%', 
              left: index * (100 / 6) + '%',
              backgroundColor: '#F59E0B'
            }"></div>
          </div>
          
          <div class="flex justify-between mt-2">
            <div v-for="item in storeStatistics.getTransactionsStats.playersWithMostMoneyDeposited" :key="item.nickname" class="text-center text-sm text-yellow-600">
              {{ item.nickname }}
            </div>
          </div>
          <div class="flex justify-between mt-0">
            <div v-for="item in storeStatistics.getTransactionsStats.playersWithMostMoneyDeposited" :key="item.nickname" class="text-center text-sm text-yellow-600">
              {{ item.total_spent }}€
            </div>
          </div>
        </div>

      </div>

      <br><br><br>


      <!-- Goals stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-yellow-600">Up to {{ registedPlayersGoal }} registed players</h2>
          <p class="text-3xl font-bold text-yellow-800">{{ storeStatistics.getUserStats.allPlayers }}</p>
          <div class="mt-4">
            <!-- Barra de Progresso -->
            <div class="w-full bg-gray-200 rounded-full h-4">
              <div :style="{ width: getPercentage(storeStatistics.getUserStats.allPlayers,registedPlayersGoal) > 100 ? 100+'%' : getPercentage(storeStatistics.getUserStats.allPlayers,registedPlayersGoal) + '%'}" 
                :class=" getPercentage(storeStatistics.getUserStats.allPlayers,registedPlayersGoal) > 100 ? 'bg-green-600 h-4 rounded-full' : 'bg-yellow-600 h-4 rounded-full'"></div>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-yellow-600">Up to {{ earnedMoneyGoal }}.00€ earned </h2>
          <p class="text-3xl font-bold text-yellow-800">{{ storeStatistics.getTransactionsStats.moneyEarned }}€</p>
          <div class="mt-4">
            <!-- Barra de Progresso -->
            <div class="w-full bg-gray-200 rounded-full h-4">
              <div :style="{ width: getPercentage(storeStatistics.getTransactionsStats.moneyEarned,earnedMoneyGoal) > 100 ? 100+'%' : getPercentage(storeStatistics.getTransactionsStats.moneyEarned,earnedMoneyGoal) + '%'}" 
                :class=" getPercentage(storeStatistics.getTransactionsStats.moneyEarned,earnedMoneyGoal) > 100 ? 'bg-green-600 h-4 rounded-full' : 'bg-yellow-600 h-4 rounded-full'"></div>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-yellow-600">Up to {{ playedGamesGoal }} games played</h2>
          <p class="text-3xl font-bold text-yellow-800">{{ storeStatistics.getGamesStats.gamesPlayed }}</p>
          <div class="mt-4">
            <!-- Barra de Progresso -->
            <div class="w-full bg-gray-200 rounded-full h-4">
              <div :style="{ width: getPercentage(storeStatistics.getGamesStats.gamesPlayed, playedGamesGoal) > 100 ? 100+'%' : getPercentage(storeStatistics.getGamesStats.gamesPlayed, playedGamesGoal) + '%'}" 
                :class=" getPercentage(storeStatistics.getGamesStats.gamesPlayed, playedGamesGoal) > 100 ? 'bg-green-600 h-4 rounded-full' : 'bg-yellow-600 h-4 rounded-full'"></div>
            </div>
          </div>
        </div>
      </div>


    </div>
</template>

