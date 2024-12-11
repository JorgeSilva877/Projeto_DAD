<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { inject } from 'vue'

const authStore = useAuthStore();
const alertDialog = inject('alertDialog')
const selectedUser = ref(null);

let currentPage = 1;

onMounted(() => {
  authStore.fetchUsers(currentPage);
});

const firstPage = () => {
  currentPage = 1;
  authStore.fetchUsers(currentPage);
};

const nextPage = () => {
  currentPage += 1;
  authStore.fetchUsers(currentPage);
};

const previousPage = () => {
  currentPage -= 1;
  authStore.fetchUsers(currentPage);
};

const lastPage = () => {
  currentPage = authStore.lastPage;
  authStore.fetchUsers(currentPage);
};

const deleteConfirmed = () => {
  if(selectedUser.value) {
    authStore.deleteUser(selectedUser.value);
  }
  authStore.fetchUsers(currentPage);
};

const deleteUser = (userId) => {
  selectedUser.value = userId;
  alertDialog.value.open(deleteConfirmed, 'Are you sure?', 'Cancel', `Yes, delete user`, 
  `This action cannot be undone. This will permanently delete the user #${userId} from our servers.`)
};

const toggleBlockStatus = (userId) => {
  authStore.updateBlock(userId);
};
</script>

<template>
  <h1 class="text-3xl mb-4 text-center text-yellow-500 font-semibold">Users</h1>
  <div class="w-full max-w-[90%] lg:max-w-[80%] mx-auto">
    <!-- Iteração sobre os usuários -->
    <div v-for="user in authStore.users" :key="user.id"
      class="relative block mb-3 bg-white p-3 rounded-lg shadow-md border border-yellow-300 hover:bg-yellow-50 transition-all duration-200">
      <!-- Exibição de informações do usuário -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-base font-semibold text-gray-700">
            {{ user.name }}
          </h2>
          <span class="text-sm text-gray-500" v-if="user.type === 'P'">
            {{ user.brain_coins_balance }} Brain Coins
          </span>
        </div>
        <p class="text-sm text-gray-500">
          Username:
          <span class="font-medium text-gray-700">
            {{ user.nickname }}
          </span>
        </p>
        <p class="text-sm text-gray-500">
          Email:
          <span class="font-medium text-gray-700">
            {{ user.email }}
          </span>
        </p>
        <p class="text-sm text-gray-500">
          Type:
          <span class="font-medium text-gray-700">
            {{ user.type }}
          </span>
        </p>
      </div>

      <!-- Botão para apagar no canto inferior direito -->
      <!-- Botões de Bloquear e Apagar -->
      <div class="absolute bottom-2 right-2 flex space-x-2">
        <!-- Botão de Bloquear -->
        <button v-if="user.type == 'P'" type="button"
          class="inline-block rounded p-1.5 text-white transition-all"
          :class="user.blocked ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'"
          @click="toggleBlockStatus(user.id)">
          {{ user.blocked ? 'Unblock' : 'Block' }}
        </button>

        <!-- Botão de Apagar -->
        <button v-if="user.id !== authStore.user.id" type="button"
          class="inline-block rounded bg-red-500 p-1.5 text-white hover:bg-red-600 transition-all"
          @click="deleteUser(user.id)">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
            stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Botões de paginação -->
    <div class="flex justify-center space-x-4 mt-4">
      <button class="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm" :disabled="currentPage === 1"
        @click="firstPage">
        First Page
      </button>
      <button class="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm" :disabled="currentPage === 1"
        @click="previousPage">
        Previous
      </button>
      <button class="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm"
        :disabled="currentPage === authStore.lastPage" @click="nextPage">
        Next
      </button>
      <button class="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm"
        @click="lastPage">
        Last Page
      </button>
    </div>
  </div>
</template>
