<script setup>


</script>

<template>
  <h1 class="text-4xl mb-2 text-center">Lets Play!</h1>
  <p class="text-xl text-gray-600 text-center mb-4">Choose your game mode</p>

  <div class="flex justify-center gap-4">
    <RouterLink :to="{ name: 'singleplayer' }"
      class="px-6 py-3 text-lg font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105">
      Singleplayer
    </RouterLink>
    <RouterLink :to="{ name: 'multiplayer' }"
      class="px-6 py-3 text-lg font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105">
      Multiplayer
    </RouterLink>
  </div>
</template>
