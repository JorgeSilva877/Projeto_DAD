<script setup>

</script>

<template>
  <div class="flex justify-center gap-4">
    <RouterLink :to="{ name: 'singleplayer_3x4' }"
      class="px-6 py-3 text-lg font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105">
      3x4
    </RouterLink>
    <RouterLink :to="{ name: 'singleplayer_4x4' }"
      class="px-6 py-3 text-lg font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105">
      4x4
    </RouterLink>
    <RouterLink :to="{ name: 'singleplayer_6x6' }"
      class="px-6 py-3 text-lg font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105">
      6x6
    </RouterLink>
  </div>

</template>