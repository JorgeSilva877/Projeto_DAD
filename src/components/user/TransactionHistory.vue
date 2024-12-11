<script setup>
import { onMounted, ref } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const transactionStore = useTransactionStore();

//variavel para guardar a pagina atual
let currentPage = 1;

// quando o componente é montado, chama a função
onMounted(() => {
  transactionStore.fetchTransactions(currentPage);
});

const firstPage = () => {
  currentPage = 1;
  transactionStore.fetchTransactions(currentPage);
};

// funcao para ir para a proxima pagina
const nextPage = () => {
  currentPage += 1;
  transactionStore.fetchTransactions(currentPage);
};

// funcao para ir para a pagina anterior

const previousPage = () => {
  currentPage -= 1;
  transactionStore.fetchTransactions(currentPage);
};

const lastPage = () => {
  currentPage = transactionStore.lastPage;
  transactionStore.fetchTransactions(currentPage);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

</script>
<template>
  <h1 class="text-3xl mb-4 text-center text-yellow-500 font-semibold">Transaction History</h1>
  <div class="w-full max-w-[90%] lg:max-w-[80%] mx-auto">
    <!-- Iteração sobre as transações -->
    <div v-for="transaction in transactionStore.transactions" :key="transaction.id"
      class="block mb-3 bg-white p-3 rounded-lg shadow-md border border-yellow-300 hover:bg-yellow-50 transition-all duration-200">
      <!-- Exibição do título e valor -->
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-base font-semibold text-gray-700">
          {{ transaction.brain_coins }} Brain Coins
        </h2>
        <span class="text-sm text-gray-500" v-if="transaction.type === 'P'">
          {{ transaction.euros }}€
        </span>
      </div>
      <!-- Exibição da data e informações específicas -->
      <div>
        <p v-if="authStore.userType === 'A'" class="text-sm text-gray-500">
          User:
          <span class="font-medium text-gray-700">
            {{ transaction.user_id }}
          </span>
        </p>
        <p class="text-sm text-gray-500">
          Date:
          <span class="font-medium text-gray-700">
            {{ formatDate(transaction.transaction_datetime) }}
          </span>
        </p>
        <p v-if="transaction.type === 'P'" class="text-sm text-gray-500">
          Method:
          <span class="font-medium text-gray-700">
            {{ transaction.payment_type }}
          </span>
        </p>
        <p v-else-if="transaction.type === 'I'" class="text-sm text-gray-500">
          Game ID:
          <span class="font-medium text-gray-700">
            {{ transaction.game_id }}
          </span>
        </p>
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
        :disabled="currentPage === transactionStore.lastPage" @click="nextPage">
        Next
      </button>
      <button class="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm"
        @click="lastPage">
        Last Page
      </button>
    </div>
  </div>
</template>
