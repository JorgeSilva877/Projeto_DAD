<script setup>

const props = defineProps({
    winnersList: Array,
    readonly: Boolean
})

</script>

<template>
    <li v-for="person in winnersList" class="p-4 bg-gray-100 rounded-lg shadow-sm">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-gray-800">{{ person.name }}</span>
              </div>
              <p class="text-gray-700 mt-2">Time: <strong>{{ person.time }} seconds</strong></p>
            </li>
</template>