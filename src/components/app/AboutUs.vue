<script setup>

import { onMounted } from 'vue'
import { useStatisticsStore } from '@/stores/statistic';

const storeStatistic = useStatisticsStore()

onMounted(() => {
  storeStatistic.fetchAnonymousStatistics();
})
</script>

<template>
    <section class="bg-yellow-50 min-h-screen text-gray-900">
      <!-- Título Genérico -->
      <div class="bg-yellow-500 py-16 text-center">
        <h1 class="text-5xl font-extrabold text-white">About Us</h1>
      </div>

      <!-- MemoryGame -->
      <div class="max-w-5xl mx-auto mt-12 px-6 py-8 bg-white shadow-lg rounded-lg">
        <h2 class="text-4xl font-bold text-yellow-500 text-center">Memory Game</h2>
        <p class="mt-6 text-lg text-gray-700 text-center">
            The memory game is a classic game made up of tiles with a picture on one side. Each figure is repeated on two different pieces. 
            To start the game, the tiles are placed with the figures facing downwards so that they cannot be seen. Each participant must, 
            in turn, turn over two pieces and let everyone see them. If the pieces are the same, the participant gets that pair. 
            If the pieces are different, they must be turned over again, and the next participant gets a turn. 
            Whoever has the most pairs at the end of the game wins.
        </p>
      </div>


      <!-- Benefits of playing the memory game -->
      <div class="max-w-5xl mx-auto mt-12 px-6 py-8 bg-white shadow-lg rounded-lg">
        <h2 class="text-4xl font-bold text-yellow-500 text-center">Benefits of Playing the Memory Game</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 text-center">
            <div class="p-6 bg-yellow-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 class="text-2xl font-bold text-yellow-500">Improved concentration and focus</h3>
            </div>
            <div class="p-6 bg-yellow-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 class="text-2xl font-bold text-yellow-500">Development of Cognitive Skills</h3>
            </div>
            <div class="p-6 bg-yellow-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 class="text-2xl font-bold text-yellow-500">Stress relief</h3>
            </div>
        </div>
      </div>
  
      <!-- Our Platform -->
      <div class="max-w-5xl mx-auto mt-12 px-6 py-8 bg-white shadow-lg rounded-lg">
        <h2 class="text-4xl font-bold text-yellow-500 text-center">Our Platform</h2>
        <p class="mt-6 text-lg text-gray-700 text-center">
            Our platform offers several ways to play. To do this, you need to register with the system and you will immediately receive 10 brain coins. 
            These brain coins give you the chance to play on boards of different sizes, or even in multiplayer against your friends! 
            Through our platform, you can also check your game statistics and access all your transactions.
        </p>
      </div>

      <!-- Our Bords Size -->
      <div class="max-w-5xl mx-auto mt-12 px-6 py-8 bg-white shadow-lg rounded-lg">
        <h2 class="text-4xl font-bold text-yellow-500 text-center">Our Boards Size</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 text-center">
            <div class="p-6 bg-yellow-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 class="text-2xl font-bold text-yellow-500">3x4</h3>
            <p class="mt-4 text-gray-700">
                Ideal for those who want to try out the game! It's available to any user and it's free to play.
            </p>
            </div>
            <div class="p-6 bg-yellow-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 class="text-2xl font-bold text-yellow-500">4x4</h3>
            <p class="mt-4 text-gray-700">
                Only available to authenticated users. It costs 1 brain coin if you play singleplayer and 5 if you play multiplayer.
            </p>
            </div>
            <div class="p-6 bg-yellow-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 class="text-2xl font-bold text-yellow-500">6x6</h3>
            <p class="mt-4 text-gray-700">
                Our most difficult board! Only available to authenticated and brave users. It costs 1 brain coin if you play singleplayer and 5 if you play multiplayer.
            </p>
            </div>
        </div>
      </div>

      <!-- Our Numbers -->
      <div v-if="storeStatistic.getTotalUsers > 0" class="max-w-5xl mx-auto mt-12 px-6 py-8 bg-white shadow-lg rounded-lg">
        <h2 class="text-4xl font-bold text-yellow-500 text-center">Our Numbers</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          <!-- Estatística 1 -->
          <div class="text-center">
            <h3 class="text-5xl font-extrabold text-yellow-500">{{ storeStatistic.getTotalUsers }}</h3>
            <p class="mt-2 text-lg text-gray-700">Registered Users</p>
          </div>
          <!-- Estatística 2 -->
          <div class="text-center">
            <h3 class="text-5xl font-extrabold text-yellow-500">{{ storeStatistic.getTotalGames }}</h3>
            <p class="mt-2 text-lg text-gray-700">Games Played</p>
          </div>
          <!-- Estatística 3 -->
          <div class="text-center">
            <h3 class="text-5xl font-extrabold text-yellow-500">{{ storeStatistic.getTotalGamesThisMonth }}</h3>
            <p class="mt-2 text-lg text-gray-700">Games Played this Month</p>
          </div>
        </div>
      </div>
    </section>
</template>
  